using System.Data;
using DBF_BridgeClubs_REST_MSSQL.Models;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

public sealed class MemberAdministrationRepository
{
    public enum CategoryStatus { Updated, MemberMissing, UnsupportedCurrent, ConcurrentChange }
    public sealed record CategoryResult(CategoryStatus Status, MemberAdministrationDto? Member = null);

    public static IReadOnlyList<FeeCategoryDto> FeeCategories { get; } =
    [new(2, "Kursus"), new(3, "Primær"), new(4, "Klub")];

    private static string Label(int? code) => code switch
    {
        2 => "Kursus", 3 => "Primær", 4 => "Klub", 0 => "Ingen", _ => "Ukendt"
    };

    private static async Task<FbConnection> OpenAsync(CancellationToken token)
    {
        var db = new FbConnection(FirebirdConnectionSettings.ConnectionString);
        await db.OpenAsync(token);
        return db;
    }

    private static async Task<MemberAdministrationDto?> GetAsync(FbConnection db, FbTransaction? tx,
        int memberId, CancellationToken token)
    {
        await using var command = new FbCommand("""
            SELECT MEMBER_ID, STATUS, CLUB_START, STATUS_CHANGED, LAST_CHANGED_BY
            FROM MEM_MEMBER WHERE MEMBER_ID = @memberId
            """, db);
        command.Transaction = tx;
        command.Parameters.AddWithValue("@memberId", memberId);
        await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow, token);
        if (!await reader.ReadAsync(token)) return null;
        var status = reader.IsDBNull(1) ? (int?)null : Convert.ToInt32(reader.GetValue(1));
        return new MemberAdministrationDto(reader.GetInt32(0), status, Label(status),
            reader.IsDBNull(2) ? null : DateOnly.FromDateTime(reader.GetDateTime(2)),
            reader.IsDBNull(3) ? null : reader.GetDateTime(3),
            reader.IsDBNull(4) ? null : reader.GetString(4).TrimEnd());
    }

    public async Task<MemberAdministrationDto?> GetAsync(int memberId, CancellationToken token)
    {
        await using var db = await OpenAsync(token);
        return await GetAsync(db, null, memberId, token);
    }

    public async Task<CategoryResult> SetFeeCategoryAsync(int memberId, int code, int expectedCode,
        CancellationToken token)
    {
        await using var db = await OpenAsync(token);
        await using var tx = (FbTransaction)await db.BeginTransactionAsync(IsolationLevel.ReadCommitted, token);
        int? current;
        try
        {
            await using var lockCommand = new FbCommand("""
                SELECT STATUS FROM MEM_MEMBER WHERE MEMBER_ID = @memberId WITH LOCK
                """, db);
            lockCommand.Transaction = tx;
            lockCommand.Parameters.AddWithValue("@memberId", memberId);
            await using var reader = await lockCommand.ExecuteReaderAsync(CommandBehavior.SingleRow, token);
            if (!await reader.ReadAsync(token)) return new(CategoryStatus.MemberMissing);
            current = reader.IsDBNull(0) ? null : Convert.ToInt32(reader.GetValue(0));
        }
        catch (FbException error) when (IsLockConflict(error))
        {
            return new(CategoryStatus.ConcurrentChange);
        }
        if (current is < 2 or > 4 or null) return new(CategoryStatus.UnsupportedCurrent);
        if (current != expectedCode) return new(CategoryStatus.ConcurrentChange);
        if (current == code) return new(CategoryStatus.Updated, await GetAsync(db, tx, memberId, token));
        try
        {
            await using var update = new FbCommand("""
                UPDATE MEM_MEMBER SET STATUS = @code, LAST_CHANGED_BY = 'REST API'
                WHERE MEMBER_ID = @memberId AND STATUS = @expectedCode AND STATUS IN (2, 3, 4)
                """, db);
            update.Transaction = tx;
            update.Parameters.AddWithValue("@code", code);
            update.Parameters.AddWithValue("@expectedCode", expectedCode);
            update.Parameters.AddWithValue("@memberId", memberId);
            if (await update.ExecuteNonQueryAsync(token) != 1)
            {
                await tx.RollbackAsync(token);
                return new(CategoryStatus.ConcurrentChange);
            }
            var member = await GetAsync(db, tx, memberId, token);
            if (member?.FeeCategoryCode != code)
            {
                await tx.RollbackAsync(token);
                return new(CategoryStatus.ConcurrentChange);
            }
            await tx.CommitAsync(token);
            return new(CategoryStatus.Updated, member);
        }
        catch (FbException error) when (IsLockConflict(error))
        {
            await tx.RollbackAsync(token);
            return new(CategoryStatus.ConcurrentChange);
        }
    }

    public async Task<List<MemberHistoryEntryDto>> HistoryAsync(int memberId, CancellationToken token)
    {
        var list = new List<MemberHistoryEntryDto>();
        await using var db = await OpenAsync(token);
        await using var command = new FbCommand("""
            SELECT FIRST 100 L.LOG_ID, L.LOG_DATE, L.LOG_USER, L.LOG_TEXT_NO,
                   T.TEXT_1, T.TEXT_2, L.VARIABLE_1, L.VARIABLE_2
            FROM SYS_LOG L LEFT JOIN SYS_LOG_TEXT T
              ON T.LOG_TEXT_NO = L.LOG_TEXT_NO AND T.LANGUAGE_CODE = 0
            WHERE L.TABLE_DEF = 2 AND L.TABLE_ID = @memberId
            ORDER BY L.LOG_DATE DESC, L.LOG_ID DESC
            """, db);
        command.Parameters.AddWithValue("@memberId", memberId);
        await using var reader = await command.ExecuteReaderAsync(token);
        while (await reader.ReadAsync(token))
        {
            string? Text(int i) => reader.IsDBNull(i) ? null : reader.GetString(i).TrimEnd();
            list.Add(new MemberHistoryEntryDto(reader.GetInt32(0), reader.GetDateTime(1),
                Text(2), reader.GetInt32(3), Text(4), Text(5), Text(6), Text(7)));
        }
        return list;
    }

    private static bool IsLockConflict(FbException error) =>
        error.SQLSTATE == "40001" || error.Message.Contains("lock conflict", StringComparison.OrdinalIgnoreCase);
}
