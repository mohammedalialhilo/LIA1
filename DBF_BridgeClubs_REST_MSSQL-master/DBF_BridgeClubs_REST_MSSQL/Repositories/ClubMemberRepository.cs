using System.Data;
using DBF_BridgeClubs_REST_MSSQL.Models;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

public sealed class ClubMemberRepository
{
    public enum AddExistingStatus { Created, ClubMissing, MemberMissing, AlreadyLinked }

    private static string ConnectionString => FirebirdConnectionSettings.ConnectionString;

    private const string MemberColumns = """
        M.MEMBER_ID, MC.CLUB_ID, M.MEMBER_NO, M.NAME, M.ADDRESS_1, M.ADDRESS_2,
        M.COUNTRY_CODE, M.ZIP_CODE, M.CITY, M.PHONE_1, M.PHONE_2, M.PHONE_3,
        M.EMAIL, M.CLUB_START
        """;

    public async Task<bool> ClubExistsAsync(int clubId, CancellationToken cancellationToken)
    {
        await using var connection = await OpenAsync(cancellationToken);
        await using var command = new FbCommand("SELECT 1 FROM MEM_CLUB WHERE CLUB_ID = @clubId", connection);
        command.Parameters.AddWithValue("@clubId", clubId);
        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }

    public async Task<List<ClubMemberResponseDto>> ListAsync(int clubId, CancellationToken cancellationToken)
    {
        var members = new List<ClubMemberResponseDto>();
        await using var connection = await OpenAsync(cancellationToken);
        await using var command = new FbCommand($"""
            SELECT {MemberColumns}
            FROM MEM_MEMBER_CLUB MC JOIN MEM_MEMBER M ON M.MEMBER_ID = MC.MEMBER_ID
            WHERE MC.CLUB_ID = @clubId ORDER BY M.NAME, M.MEMBER_ID
            """, connection);
        command.Parameters.AddWithValue("@clubId", clubId);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken)) members.Add(ReadMember(reader));
        return members;
    }

    public async Task<ClubMemberResponseDto?> GetAsync(int clubId, int memberId, CancellationToken cancellationToken)
    {
        await using var connection = await OpenAsync(cancellationToken);
        return await GetAsync(connection, null, clubId, memberId, cancellationToken);
    }

    public async Task<List<ExistingMemberSearchResultDto>> SearchExistingAsync(
        int destinationClubId, string search, CancellationToken cancellationToken)
    {
        var results = new List<ExistingMemberSearchResultDto>();
        if (string.IsNullOrWhiteSpace(search)) return results;

        await using var connection = await OpenAsync(cancellationToken);
        await using (var command = new FbCommand("""
            SELECT FIRST 25 MEMBER_ID, MEMBER_NO, NAME
            FROM MEM_MEMBER
            WHERE NAME CONTAINING @search OR MEMBER_NO = @number OR MEMBER_ID = @number
            ORDER BY NAME, MEMBER_ID
            """, connection))
        {
            command.Parameters.AddWithValue("@search", search.Trim());
            command.Parameters.AddWithValue("@number", int.TryParse(search.Trim(), out var number) ? number : -1);
            await using var reader = await command.ExecuteReaderAsync(cancellationToken);
            while (await reader.ReadAsync(cancellationToken))
            {
                results.Add(new ExistingMemberSearchResultDto
                {
                    MemberId = reader.GetInt32(0),
                    MemberNo = reader.IsDBNull(1) ? null : reader.GetInt32(1),
                    Name = reader.IsDBNull(2) ? string.Empty : reader.GetString(2).TrimEnd(),
                });
            }
        }

        if (results.Count == 0) return results;
        var byId = results.ToDictionary(member => member.MemberId);
        var placeholders = results.Select((_, index) => $"@member{index}").ToArray();
        await using var memberships = new FbCommand($"""
            SELECT MC.MEMBER_ID, MC.CLUB_ID, C.CLUB_NAME
            FROM MEM_MEMBER_CLUB MC
            LEFT JOIN MEM_CLUB C ON C.CLUB_ID = MC.CLUB_ID
            WHERE MC.MEMBER_ID IN ({string.Join(", ", placeholders)})
            ORDER BY MC.MEMBER_ID, C.CLUB_NAME
            """, connection);
        for (var index = 0; index < results.Count; index++)
            memberships.Parameters.AddWithValue(placeholders[index], results[index].MemberId);
        await using var membershipReader = await memberships.ExecuteReaderAsync(cancellationToken);
        while (await membershipReader.ReadAsync(cancellationToken))
        {
            var member = byId[membershipReader.GetInt32(0)];
            var clubId = membershipReader.GetInt32(1);
            member.Subclubs.Add(new ExistingMemberSubclubDto
            {
                ClubId = clubId,
                ClubName = membershipReader.IsDBNull(2)
                    ? $"Underklub {clubId}"
                    : membershipReader.GetString(2).TrimEnd(),
            });
            if (clubId == destinationClubId) member.AlreadyAssigned = true;
        }
        return results;
    }

    public async Task<(AddExistingStatus Status, MemberClubLinkResponseDto? Link)> AddExistingAsync(
        int clubId, int memberId, CancellationToken cancellationToken)
    {
        await using var connection = await OpenAsync(cancellationToken);
        await using var transaction = (FbTransaction)await connection.BeginTransactionAsync(cancellationToken);
        if (!await ClubExistsAsync(connection, transaction, clubId, cancellationToken))
            return (AddExistingStatus.ClubMissing, null);
        if (!await MemberExistsAsync(connection, transaction, memberId, cancellationToken))
            return (AddExistingStatus.MemberMissing, null);
        if (await LinkExistsAsync(connection, transaction, clubId, memberId, cancellationToken))
            return (AddExistingStatus.AlreadyLinked, null);

        int linkId;
        try
        {
            await using var insert = new FbCommand("""
                INSERT INTO MEM_MEMBER_CLUB
                    (MEMBER_CLUB_ID, MEMBER_ID, CLUB_ID, LAST_CHANGED_BY, LAST_CHANGED_DATE)
                VALUES (GEN_ID(MEMBER_CLUB, 1), @memberId, @clubId, 'REST API', CURRENT_TIMESTAMP)
                RETURNING MEMBER_CLUB_ID
                """, connection);
            insert.Transaction = transaction;
            insert.Parameters.AddWithValue("@memberId", memberId);
            insert.Parameters.AddWithValue("@clubId", clubId);
            linkId = Convert.ToInt32(await insert.ExecuteScalarAsync(cancellationToken));
        }
        catch (FbException)
        {
            // The unique member/club index is the final guard when requests race.
            await transaction.RollbackAsync(cancellationToken);
            await using var freshConnection = await OpenAsync(cancellationToken);
            if (await LinkExistsAsync(freshConnection, null, clubId, memberId, cancellationToken))
                return (AddExistingStatus.AlreadyLinked, null);
            throw;
        }
        await transaction.CommitAsync(cancellationToken);
        return (AddExistingStatus.Created, new MemberClubLinkResponseDto
        {
            MemberClubId = linkId,
            MemberId = memberId,
            ClubId = clubId,
        });
    }

    public async Task<(ClubMemberResponseDto? Member, bool Duplicate, bool ClubMissing)> CreateAsync(
        int clubId, CreateClubMemberDto input, CancellationToken cancellationToken)
    {
        await using var connection = await OpenAsync(cancellationToken);
        await using var transaction = (FbTransaction)await connection.BeginTransactionAsync(cancellationToken);
        if (!await ClubExistsAsync(connection, transaction, clubId, cancellationToken))
            return (null, false, true);

        if (input.MemberNo is { } memberNo && await MemberNoExistsAsync(connection, transaction, memberNo, cancellationToken))
            return (null, true, false);

        await using var insertMember = new FbCommand("""
            INSERT INTO MEM_MEMBER
                (MEMBER_ID, MEMBER_NO, NAME, ADDRESS_1, ADDRESS_2, COUNTRY_CODE,
                 ZIP_CODE, CITY, PHONE_1, PHONE_2, PHONE_3, EMAIL, CLUB_START, LAST_CHANGED_BY)
            VALUES
                (GEN_ID(MEMBER, 1), @memberNo, @name, @address1, @address2, @countryCode,
                 @zipCode, @city, @phone1, @phone2, @phone3, @email, @clubStart, 'REST API')
            RETURNING MEMBER_ID
            """, connection);
        insertMember.Transaction = transaction;
        Add(insertMember, "@memberNo", input.MemberNo);
        Add(insertMember, "@name", input.Name.Trim());
        Add(insertMember, "@address1", input.Address1);
        Add(insertMember, "@address2", input.Address2);
        Add(insertMember, "@countryCode", input.CountryCode);
        Add(insertMember, "@zipCode", input.ZipCode);
        Add(insertMember, "@city", input.City);
        Add(insertMember, "@phone1", input.Phone1);
        Add(insertMember, "@phone2", input.Phone2);
        Add(insertMember, "@phone3", input.Phone3);
        Add(insertMember, "@email", input.Email);
        Add(insertMember, "@clubStart", input.ClubStart?.ToDateTime(TimeOnly.MinValue));
        var memberId = Convert.ToInt32(await insertMember.ExecuteScalarAsync(cancellationToken));

        await using var insertLink = new FbCommand("""
            INSERT INTO MEM_MEMBER_CLUB
                (MEMBER_CLUB_ID, MEMBER_ID, CLUB_ID, LAST_CHANGED_BY, LAST_CHANGED_DATE)
            VALUES (GEN_ID(MEMBER_CLUB, 1), @memberId, @clubId, 'REST API', CURRENT_TIMESTAMP)
            """, connection);
        insertLink.Transaction = transaction;
        insertLink.Parameters.AddWithValue("@memberId", memberId);
        insertLink.Parameters.AddWithValue("@clubId", clubId);
        await insertLink.ExecuteNonQueryAsync(cancellationToken);

        var member = await GetAsync(connection, transaction, clubId, memberId, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return (member, false, false);
    }

    public async Task<ClubMemberResponseDto?> UpdateAsync(
        int clubId, int memberId, UpdateClubMemberDto input, CancellationToken cancellationToken)
    {
        await using var connection = await OpenAsync(cancellationToken);
        await using var transaction = (FbTransaction)await connection.BeginTransactionAsync(cancellationToken);
        if (await GetAsync(connection, transaction, clubId, memberId, cancellationToken) is null)
            return null;

        var changes = new List<(string Column, object Value)>();
        if (input.Name is not null) changes.Add(("NAME", input.Name.Trim()));
        if (input.Address1 is not null) changes.Add(("ADDRESS_1", input.Address1));
        if (input.Address2 is not null) changes.Add(("ADDRESS_2", input.Address2));
        if (input.CountryCode is not null) changes.Add(("COUNTRY_CODE", input.CountryCode));
        if (input.ZipCode is not null) changes.Add(("ZIP_CODE", input.ZipCode));
        if (input.City is not null) changes.Add(("CITY", input.City));
        if (input.Phone1 is not null) changes.Add(("PHONE_1", input.Phone1));
        if (input.Phone2 is not null) changes.Add(("PHONE_2", input.Phone2));
        if (input.Phone3 is not null) changes.Add(("PHONE_3", input.Phone3));
        if (input.Email is not null) changes.Add(("EMAIL", input.Email));
        if (input.ClubStart is { } date) changes.Add(("CLUB_START", date.ToDateTime(TimeOnly.MinValue)));

        if (changes.Count > 0)
        {
            var assignments = string.Join(", ", changes.Select((change, index) => $"{change.Column} = @value{index}"));
            await using var update = new FbCommand($"""
                UPDATE MEM_MEMBER SET {assignments}, LAST_CHANGED_BY = 'REST API'
                WHERE MEMBER_ID = @memberId AND EXISTS
                    (SELECT 1 FROM MEM_MEMBER_CLUB WHERE MEMBER_ID = @memberId AND CLUB_ID = @clubId)
                """, connection);
            update.Transaction = transaction;
            for (var i = 0; i < changes.Count; i++) Add(update, $"@value{i}", changes[i].Value);
            update.Parameters.AddWithValue("@memberId", memberId);
            update.Parameters.AddWithValue("@clubId", clubId);
            if (await update.ExecuteNonQueryAsync(cancellationToken) == 0) return null;
        }

        var member = await GetAsync(connection, transaction, clubId, memberId, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return member;
    }

    private static async Task<FbConnection> OpenAsync(CancellationToken cancellationToken)
    {
        var connection = new FbConnection(ConnectionString);
        try { await connection.OpenAsync(cancellationToken); return connection; }
        catch { await connection.DisposeAsync(); throw; }
    }

    private static async Task<bool> ClubExistsAsync(
        FbConnection connection, FbTransaction transaction, int clubId, CancellationToken cancellationToken)
    {
        await using var command = new FbCommand("SELECT 1 FROM MEM_CLUB WHERE CLUB_ID = @clubId", connection);
        command.Transaction = transaction;
        command.Parameters.AddWithValue("@clubId", clubId);
        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }

    private static async Task<bool> MemberNoExistsAsync(
        FbConnection connection, FbTransaction transaction, int memberNo, CancellationToken cancellationToken)
    {
        await using var command = new FbCommand("SELECT 1 FROM MEM_MEMBER WHERE MEMBER_NO = @memberNo", connection);
        command.Transaction = transaction;
        command.Parameters.AddWithValue("@memberNo", memberNo);
        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }

    private static async Task<bool> MemberExistsAsync(
        FbConnection connection, FbTransaction transaction, int memberId, CancellationToken cancellationToken)
    {
        await using var command = new FbCommand("SELECT 1 FROM MEM_MEMBER WHERE MEMBER_ID = @memberId", connection);
        command.Transaction = transaction;
        command.Parameters.AddWithValue("@memberId", memberId);
        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }

    private static async Task<bool> LinkExistsAsync(
        FbConnection connection, FbTransaction? transaction,
        int clubId, int memberId, CancellationToken cancellationToken)
    {
        await using var command = new FbCommand("""
            SELECT 1 FROM MEM_MEMBER_CLUB WHERE MEMBER_ID = @memberId AND CLUB_ID = @clubId
            """, connection);
        command.Transaction = transaction;
        command.Parameters.AddWithValue("@memberId", memberId);
        command.Parameters.AddWithValue("@clubId", clubId);
        return await command.ExecuteScalarAsync(cancellationToken) is not null;
    }

    private static async Task<ClubMemberResponseDto?> GetAsync(
        FbConnection connection, FbTransaction? transaction,
        int clubId, int memberId, CancellationToken cancellationToken)
    {
        await using var command = new FbCommand($"""
            SELECT {MemberColumns}
            FROM MEM_MEMBER_CLUB MC JOIN MEM_MEMBER M ON M.MEMBER_ID = MC.MEMBER_ID
            WHERE MC.CLUB_ID = @clubId AND M.MEMBER_ID = @memberId
            """, connection);
        command.Transaction = transaction;
        command.Parameters.AddWithValue("@clubId", clubId);
        command.Parameters.AddWithValue("@memberId", memberId);
        await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow, cancellationToken);
        return await reader.ReadAsync(cancellationToken) ? ReadMember(reader) : null;
    }

    private static ClubMemberResponseDto ReadMember(IDataRecord row)
    {
        object? Value(string name) => row.IsDBNull(row.GetOrdinal(name)) ? null : row[name];
        string? String(string name) => Value(name)?.ToString()?.TrimEnd();
        return new ClubMemberResponseDto
        {
            MemberId = Convert.ToInt32(Value("MEMBER_ID")),
            ClubId = Convert.ToInt32(Value("CLUB_ID")),
            MemberNo = Value("MEMBER_NO") is { } number ? Convert.ToInt32(number) : null,
            Name = String("NAME"), Address1 = String("ADDRESS_1"), Address2 = String("ADDRESS_2"),
            CountryCode = String("COUNTRY_CODE"), ZipCode = String("ZIP_CODE"), City = String("CITY"),
            Phone1 = String("PHONE_1"), Phone2 = String("PHONE_2"), Phone3 = String("PHONE_3"),
            Email = String("EMAIL"),
            ClubStart = Value("CLUB_START") is { } date ? DateOnly.FromDateTime(Convert.ToDateTime(date)) : null,
        };
    }

    private static void Add(FbCommand command, string name, object? value) =>
        command.Parameters.AddWithValue(name, value ?? DBNull.Value);
}
