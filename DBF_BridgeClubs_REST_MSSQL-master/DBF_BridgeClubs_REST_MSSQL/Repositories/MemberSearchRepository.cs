using System.Data;
using System.Text;
using DBF_BridgeClubs_REST_MSSQL.Models;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

public sealed class MemberSearchRepository
{
    private sealed record Prepared(string Where, List<(string Name, object Value)> Parameters);

    private static Prepared Prepare(MemberSearchQuery input)
    {
        var clauses = new List<string>();
        var parameters = new List<(string, object)>();
        if (!string.IsNullOrWhiteSpace(input.Query))
        {
            clauses.Add("(M.NAME CONTAINING @query OR M.MEMBER_NO = @number)");
            parameters.Add(("@query", input.Query.Trim()));
            parameters.Add(("@number", int.TryParse(input.Query.Trim(), out var number) ? number : -1));
        }
        if (!string.IsNullOrWhiteSpace(input.City))
        {
            clauses.Add("M.CITY CONTAINING @city");
            parameters.Add(("@city", input.City.Trim()));
        }
        if (input.FeeCategory is { } category)
        {
            clauses.Add("M.STATUS = @category");
            parameters.Add(("@category", category));
        }
        if (input.StartFrom is { } from)
        {
            clauses.Add("M.CLUB_START >= @startFrom");
            parameters.Add(("@startFrom", from.ToDateTime(TimeOnly.MinValue)));
        }
        if (input.StartTo is { } to)
        {
            clauses.Add("M.CLUB_START <= @startTo");
            parameters.Add(("@startTo", to.ToDateTime(TimeOnly.MinValue)));
        }
        if (input.SubclubId is { } clubId)
        {
            var memberConditions = new List<string> { "MC.MEMBER_ID = M.MEMBER_ID", "MC.CLUB_ID = @clubId" };
            parameters.Add(("@clubId", clubId));
            if (input.IsSubstitute is { } substitute)
                memberConditions.Add(substitute ? "MC.IS_SUBSTITUTE = 'T'" : "MC.IS_SUBSTITUTE = 'F'");
            if (input.HasPartner is { } partner)
                memberConditions.Add(partner ? "COALESCE(MC.PARTNER_ID, 0) > 0" : "COALESCE(MC.PARTNER_ID, 0) = 0");
            clauses.Add($"EXISTS (SELECT 1 FROM MEM_MEMBER_CLUB MC WHERE {string.Join(" AND ", memberConditions)})");
        }
        return new Prepared(clauses.Count == 0 ? "" : "WHERE " + string.Join(" AND ", clauses), parameters);
    }

    private static void Bind(FbCommand command, Prepared prepared)
    {
        foreach (var (name, value) in prepared.Parameters) command.Parameters.AddWithValue(name, value);
    }

    private static string SortSql(MemberSearchQuery input) => input.Sort switch
    {
        "memberNo" => "M.MEMBER_NO",
        "city" => "M.CITY",
        "clubStart" => "M.CLUB_START",
        _ => "M.NAME",
    } + (input.Descending ? " DESC" : " ASC") + ", M.MEMBER_ID ASC";

    private const string Columns = """
        M.MEMBER_ID, M.MEMBER_NO, M.NAME, M.CITY, M.PHONE_1, M.EMAIL, M.CLUB_START, M.STATUS,
        (SELECT LIST(TRIM(C.CLUB_NAME), ', ') FROM MEM_MEMBER_CLUB MC
         JOIN MEM_CLUB C ON C.CLUB_ID = MC.CLUB_ID WHERE MC.MEMBER_ID = M.MEMBER_ID)
        """;

    private static MemberSearchItemDto Read(IDataRecord row)
    {
        string? Text(int i) => row.IsDBNull(i) ? null : row.GetValue(i).ToString()?.TrimEnd();
        return new MemberSearchItemDto(row.GetInt32(0), row.IsDBNull(1) ? null : row.GetInt32(1),
            Text(2) ?? "", Text(3), Text(4), Text(5),
            row.IsDBNull(6) ? null : DateOnly.FromDateTime(Convert.ToDateTime(row.GetValue(6))),
            row.IsDBNull(7) ? null : Convert.ToInt32(row.GetValue(7)), Text(8) ?? "");
    }

    public async Task<MemberSearchPageDto> SearchAsync(MemberSearchQuery input, CancellationToken token)
    {
        var prepared = Prepare(input);
        await using var db = new FbConnection(FirebirdConnectionSettings.ConnectionString);
        await db.OpenAsync(token);
        await using var countCommand = new FbCommand($"SELECT COUNT(*) FROM MEM_MEMBER M {prepared.Where}", db);
        Bind(countCommand, prepared);
        var total = Convert.ToInt32(await countCommand.ExecuteScalarAsync(token));
        var items = new List<MemberSearchItemDto>();
        await using var query = new FbCommand($"""
            SELECT FIRST @pageSize SKIP @offset {Columns}
            FROM MEM_MEMBER M {prepared.Where} ORDER BY {SortSql(input)}
            """, db);
        Bind(query, prepared);
        query.Parameters.AddWithValue("@pageSize", input.PageSize);
        query.Parameters.AddWithValue("@offset", checked((input.Page - 1) * input.PageSize));
        await using var reader = await query.ExecuteReaderAsync(token);
        while (await reader.ReadAsync(token)) items.Add(Read(reader));
        return new MemberSearchPageDto(total, input.Page, input.PageSize, items);
    }

    public async Task<(byte[]? Csv, int Total)> ExportAsync(MemberSearchQuery input, CancellationToken token)
    {
        var prepared = Prepare(input);
        await using var db = new FbConnection(FirebirdConnectionSettings.ConnectionString);
        await db.OpenAsync(token);
        await using var countCommand = new FbCommand($"SELECT COUNT(*) FROM MEM_MEMBER M {prepared.Where}", db);
        Bind(countCommand, prepared);
        var total = Convert.ToInt32(await countCommand.ExecuteScalarAsync(token));
        if (total > 5000) return (null, total);
        await using var query = new FbCommand($"""
            SELECT {Columns} FROM MEM_MEMBER M {prepared.Where} ORDER BY {SortSql(input)}
            """, db);
        Bind(query, prepared);
        await using var reader = await query.ExecuteReaderAsync(token);
        var csv = new StringBuilder("Medlemsnr.;Navn;Underklubber;By;E-mail;Telefon;Klubstart;Kontingentkategori\r\n");
        while (await reader.ReadAsync(token))
        {
            var row = Read(reader);
            var cells = new[] { row.MemberNo?.ToString(), row.Name, row.Subclubs, row.City,
                row.Email, row.Phone1, row.ClubStart?.ToString("yyyy-MM-dd"),
                row.FeeCategoryCode switch { 2 => "Kursus", 3 => "Primær", 4 => "Klub", _ => null } };
            csv.AppendJoin(';', cells.Select(Escape)).Append("\r\n");
        }
        return (Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csv.ToString())).ToArray(), total);
    }

    private static string Escape(string? value)
    {
        var safe = value ?? "";
        if (safe.Length > 0 && "=+-@".Contains(safe[0])) safe = "'" + safe;
        return '"' + safe.Replace("\"", "\"\"") + '"';
    }
}
