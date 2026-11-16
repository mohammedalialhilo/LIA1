using System.Data;
using DBF_BridgeClubs_REST_MSSQL.Models;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

public sealed class ClubPartnerRepository
{
    public enum ChangeStatus
    {
        Changed, ClubMissing, MemberMissing, MembershipMissing, PartnerMissing,
        SelfPartner, AlreadyPaired, PartnerBusy, Inconsistent, GroupAssigned,
        InvalidSubstituteValue, ConcurrentChange
    }

    public sealed record ChangeResult(ChangeStatus Status, PartnerStateDto? Partner = null,
        SubstituteStateDto? Substitute = null);

    private sealed record Link(int Id, int MemberId, int? PartnerId, string First, string Substitute, short GroupIndex)
    {
        public int Partner => PartnerId.GetValueOrDefault();
    }

    private static async Task<FbConnection> OpenAsync(CancellationToken token)
    {
        var connection = new FbConnection(FirebirdConnectionSettings.ConnectionString);
        await connection.OpenAsync(token);
        return connection;
    }

    private static async Task<bool> ExistsAsync(FbConnection db, FbTransaction? tx, string table,
        string column, int id, CancellationToken token)
    {
        // Table and column are fixed constants supplied below, never request input.
        await using var command = new FbCommand($"SELECT 1 FROM {table} WHERE {column} = @id", db);
        command.Transaction = tx;
        command.Parameters.AddWithValue("@id", id);
        return await command.ExecuteScalarAsync(token) is not null;
    }

    private static Task<bool> ClubExists(FbConnection db, FbTransaction? tx, int id, CancellationToken token) =>
        ExistsAsync(db, tx, "MEM_CLUB", "CLUB_ID", id, token);

    private static Task<bool> MemberExists(FbConnection db, FbTransaction? tx, int id, CancellationToken token) =>
        ExistsAsync(db, tx, "MEM_MEMBER", "MEMBER_ID", id, token);

    private static async Task<Link?> ReadLink(FbConnection db, FbTransaction? tx, int clubId, int memberId,
        bool locked, CancellationToken token)
    {
        await using var command = new FbCommand($"""
            SELECT MEMBER_CLUB_ID, MEMBER_ID, PARTNER_ID, PARTNER_FIRST, IS_SUBSTITUTE, GROUP_INDEX
            FROM MEM_MEMBER_CLUB WHERE CLUB_ID = @clubId AND MEMBER_ID = @memberId
            {(locked ? "WITH LOCK" : "")}
            """, db);
        command.Transaction = tx;
        command.Parameters.AddWithValue("@clubId", clubId);
        command.Parameters.AddWithValue("@memberId", memberId);
        await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow, token);
        if (!await reader.ReadAsync(token)) return null;
        return new Link(reader.GetInt32(0), reader.GetInt32(1),
            reader.IsDBNull(2) ? null : reader.GetInt32(2),
            reader.IsDBNull(3) ? "" : reader.GetString(3).Trim(),
            reader.IsDBNull(4) ? "" : reader.GetString(4).Trim(),
            reader.IsDBNull(5) ? (short)0 : reader.GetInt16(5));
    }

    private static async Task<bool> HasOtherReference(FbConnection db, FbTransaction tx, int clubId,
        int targetMemberId, int exceptMemberId, CancellationToken token)
    {
        await using var command = new FbCommand("""
            SELECT FIRST 1 1 FROM MEM_MEMBER_CLUB
            WHERE CLUB_ID = @clubId AND PARTNER_ID = @targetId AND MEMBER_ID <> @exceptId
            """, db);
        command.Transaction = tx;
        command.Parameters.AddWithValue("@clubId", clubId);
        command.Parameters.AddWithValue("@targetId", targetMemberId);
        command.Parameters.AddWithValue("@exceptId", exceptMemberId);
        return await command.ExecuteScalarAsync(token) is not null;
    }

    public async Task<bool> MembershipExistsAsync(int clubId, int memberId, CancellationToken token)
    {
        await using var db = await OpenAsync(token);
        return await ReadLink(db, null, clubId, memberId, false, token) is not null;
    }

    public async Task<bool> ClubExistsAsync(int clubId, CancellationToken token)
    {
        await using var db = await OpenAsync(token);
        return await ClubExists(db, null, clubId, token);
    }

    public async Task<List<EligiblePartnerDto>> EligibleAsync(int clubId, int memberId,
        string search, CancellationToken token)
    {
        var list = new List<EligiblePartnerDto>();
        await using var db = await OpenAsync(token);
        await using var command = new FbCommand("""
            SELECT FIRST 50 M.MEMBER_ID, M.MEMBER_NO, M.NAME
            FROM MEM_MEMBER_CLUB MC JOIN MEM_MEMBER M ON M.MEMBER_ID = MC.MEMBER_ID
            WHERE MC.CLUB_ID = @clubId AND MC.MEMBER_ID <> @memberId
              AND COALESCE(MC.PARTNER_ID, 0) = 0 AND COALESCE(MC.GROUP_INDEX, 0) = 0
              AND NOT EXISTS (SELECT 1 FROM MEM_MEMBER_CLUB P
                              WHERE P.CLUB_ID = @clubId AND P.PARTNER_ID = MC.MEMBER_ID)
              AND (M.NAME CONTAINING @search OR M.MEMBER_NO = @number)
            ORDER BY M.NAME, M.MEMBER_ID
            """, db);
        command.Parameters.AddWithValue("@clubId", clubId);
        command.Parameters.AddWithValue("@memberId", memberId);
        command.Parameters.AddWithValue("@search", search.Trim());
        command.Parameters.AddWithValue("@number", int.TryParse(search.Trim(), out var number) ? number : -1);
        await using var reader = await command.ExecuteReaderAsync(token);
        while (await reader.ReadAsync(token))
            list.Add(new EligiblePartnerDto(reader.GetInt32(0), reader.IsDBNull(1) ? null : reader.GetInt32(1),
                reader.IsDBNull(2) ? "" : reader.GetString(2).TrimEnd()));
        return list;
    }

    public async Task<List<EligiblePartnerDto>> SubstitutesAsync(int clubId, string search,
        CancellationToken token)
    {
        var list = new List<EligiblePartnerDto>();
        await using var db = await OpenAsync(token);
        await using var command = new FbCommand("""
            SELECT FIRST 50 M.MEMBER_ID, M.MEMBER_NO, M.NAME
            FROM MEM_MEMBER_CLUB MC JOIN MEM_MEMBER M ON M.MEMBER_ID = MC.MEMBER_ID
            WHERE MC.CLUB_ID = @clubId AND MC.IS_SUBSTITUTE = 'T'
              AND (M.NAME CONTAINING @search OR M.MEMBER_NO = @number)
            ORDER BY M.NAME, M.MEMBER_ID
            """, db);
        command.Parameters.AddWithValue("@clubId", clubId);
        command.Parameters.AddWithValue("@search", search.Trim());
        command.Parameters.AddWithValue("@number", int.TryParse(search.Trim(), out var number) ? number : -1);
        await using var reader = await command.ExecuteReaderAsync(token);
        while (await reader.ReadAsync(token))
            list.Add(new EligiblePartnerDto(reader.GetInt32(0), reader.IsDBNull(1) ? null : reader.GetInt32(1),
                reader.IsDBNull(2) ? "" : reader.GetString(2).TrimEnd()));
        return list;
    }

    public async Task<ChangeResult> SetPartnerAsync(int clubId, int memberId, int? newPartnerId,
        int expectedPartnerId,
        CancellationToken token)
    {
        if (newPartnerId == memberId) return new(ChangeStatus.SelfPartner);
        await using var db = await OpenAsync(token);
        await using var tx = (FbTransaction)await db.BeginTransactionAsync(IsolationLevel.ReadCommitted, token);
        if (!await ClubExists(db, tx, clubId, token)) return new(ChangeStatus.ClubMissing);
        if (!await MemberExists(db, tx, memberId, token)) return new(ChangeStatus.MemberMissing);
        if (newPartnerId is { } targetId && !await MemberExists(db, tx, targetId, token))
            return new(ChangeStatus.PartnerMissing);

        var initial = await ReadLink(db, tx, clubId, memberId, false, token);
        if (initial is null) return new(ChangeStatus.MembershipMissing);
        if (initial.Partner != expectedPartnerId) return new(ChangeStatus.ConcurrentChange);
        if (initial.Partner > 0 && await ReadLink(db, tx, clubId, initial.Partner, false, token) is null)
            return new(ChangeStatus.Inconsistent);
        if (newPartnerId is { } candidateId && await ReadLink(db, tx, clubId, candidateId, false, token) is null)
            return new(ChangeStatus.PartnerMissing);

        var lockIds = new[] { memberId, initial.Partner, newPartnerId.GetValueOrDefault() }
            .Where(id => id > 0).Distinct().Order().ToArray();
        var locked = new Dictionary<int, Link>();
        try
        {
            foreach (var id in lockIds)
            {
                var row = await ReadLink(db, tx, clubId, id, true, token);
                if (row is null) return new(ChangeStatus.ConcurrentChange);
                locked[id] = row;
            }
        }
        catch (FbException error) when (IsLockConflict(error))
        {
            return new(ChangeStatus.ConcurrentChange);
        }

        var source = locked[memberId];
        if (source.Partner != expectedPartnerId) return new(ChangeStatus.ConcurrentChange);
        if (source.GroupIndex != 0 || locked.Values.Any(row => row.GroupIndex != 0))
            return new(ChangeStatus.GroupAssigned);
        if (source.Partner > 0)
        {
            var old = locked[source.Partner];
            if (old.Partner != memberId || !OppositeFirst(source.First, old.First) ||
                await HasOtherReference(db, tx, clubId, memberId, old.MemberId, token) ||
                await HasOtherReference(db, tx, clubId, old.MemberId, memberId, token))
                return new(ChangeStatus.Inconsistent);
        }
        else if (source.First != "F" ||
                 await HasOtherReference(db, tx, clubId, memberId, -1, token))
            return new(ChangeStatus.Inconsistent);

        if (newPartnerId is { } nextId)
        {
            if (source.Partner == nextId) return new(ChangeStatus.AlreadyPaired);
            var candidate = locked[nextId];
            if (candidate.Partner > 0 || candidate.First != "F" ||
                await HasOtherReference(db, tx, clubId, nextId, memberId, token))
                return new(ChangeStatus.PartnerBusy);
        }
        else if (source.Partner == 0) return new(ChangeStatus.AlreadyPaired);

        try
        {
            await using var command = new FbCommand("""
                UPDATE MEM_MEMBER_CLUB
                SET PARTNER_ID = @newPartnerId, PARTNER_FIRST = @first,
                    LAST_CHANGED_BY = 'REST API', LAST_CHANGED_DATE = CURRENT_TIMESTAMP
                WHERE MEMBER_CLUB_ID = @linkId AND CLUB_ID = @clubId AND MEMBER_ID = @memberId
                  AND COALESCE(PARTNER_ID, 0) = @oldPartnerId AND COALESCE(GROUP_INDEX, 0) = 0
                """, db);
            command.Transaction = tx;
            command.Parameters.AddWithValue("@newPartnerId", newPartnerId is { } newId ? newId : DBNull.Value);
            command.Parameters.AddWithValue("@first", newPartnerId is null ? "F" : source.Partner > 0 ? source.First : "T");
            command.Parameters.AddWithValue("@linkId", source.Id);
            command.Parameters.AddWithValue("@clubId", clubId);
            command.Parameters.AddWithValue("@memberId", memberId);
            command.Parameters.AddWithValue("@oldPartnerId", source.Partner);
            if (await command.ExecuteNonQueryAsync(token) != 1)
            {
                await tx.RollbackAsync(token);
                return new(ChangeStatus.ConcurrentChange);
            }
            var updated = await ReadLink(db, tx, clubId, memberId, false, token);
            if (updated?.Partner != newPartnerId.GetValueOrDefault() ||
                updated.First != (newPartnerId is null ? "F" : source.Partner > 0 ? source.First : "T"))
            {
                await tx.RollbackAsync(token);
                return new(ChangeStatus.Inconsistent);
            }
            if (source.Partner > 0 && source.Partner != newPartnerId)
            {
                var old = await ReadLink(db, tx, clubId, source.Partner, false, token);
                if (old?.Partner != 0 || old.First != "F")
                {
                    await tx.RollbackAsync(token);
                    return new(ChangeStatus.Inconsistent);
                }
            }
            if (newPartnerId is { } partnerId)
            {
                var partner = await ReadLink(db, tx, clubId, partnerId, false, token);
                if (partner?.Partner != memberId || !OppositeFirst(updated.First, partner.First))
                {
                    await tx.RollbackAsync(token);
                    return new(ChangeStatus.Inconsistent);
                }
            }
            await tx.CommitAsync(token);
            return new(ChangeStatus.Changed,
                new PartnerStateDto(memberId, clubId, newPartnerId, updated.First));
        }
        catch (FbException error) when (IsLockConflict(error))
        {
            await tx.RollbackAsync(token);
            return new(ChangeStatus.ConcurrentChange);
        }
    }

    public async Task<ChangeResult> SetSubstituteAsync(int clubId, int memberId, bool isSubstitute,
        bool expectedIsSubstitute,
        CancellationToken token)
    {
        await using var db = await OpenAsync(token);
        await using var tx = (FbTransaction)await db.BeginTransactionAsync(IsolationLevel.ReadCommitted, token);
        if (!await ClubExists(db, tx, clubId, token)) return new(ChangeStatus.ClubMissing);
        if (!await MemberExists(db, tx, memberId, token)) return new(ChangeStatus.MemberMissing);
        Link? source;
        try { source = await ReadLink(db, tx, clubId, memberId, true, token); }
        catch (FbException error) when (IsLockConflict(error)) { return new(ChangeStatus.ConcurrentChange); }
        if (source is null) return new(ChangeStatus.MembershipMissing);
        if (source.Substitute is not ("T" or "F")) return new(ChangeStatus.InvalidSubstituteValue);
        if ((source.Substitute == "T") != expectedIsSubstitute) return new(ChangeStatus.ConcurrentChange);
        var next = isSubstitute ? "T" : "F";
        if (source.Substitute == next)
            return new(ChangeStatus.Changed, Substitute: new SubstituteStateDto(memberId, clubId, isSubstitute));
        try
        {
            await using var command = new FbCommand("""
                UPDATE MEM_MEMBER_CLUB
                SET IS_SUBSTITUTE = @status, LAST_CHANGED_BY = 'REST API',
                    LAST_CHANGED_DATE = CURRENT_TIMESTAMP
                WHERE MEMBER_CLUB_ID = @linkId AND CLUB_ID = @clubId AND MEMBER_ID = @memberId
                  AND IS_SUBSTITUTE = @oldStatus
                """, db);
            command.Transaction = tx;
            command.Parameters.AddWithValue("@status", next);
            command.Parameters.AddWithValue("@oldStatus", source.Substitute);
            command.Parameters.AddWithValue("@linkId", source.Id);
            command.Parameters.AddWithValue("@clubId", clubId);
            command.Parameters.AddWithValue("@memberId", memberId);
            if (await command.ExecuteNonQueryAsync(token) != 1)
            {
                await tx.RollbackAsync(token);
                return new(ChangeStatus.ConcurrentChange);
            }
            var updated = await ReadLink(db, tx, clubId, memberId, false, token);
            if (updated?.Substitute != next || updated.Partner != source.Partner ||
                updated.First != source.First || updated.GroupIndex != source.GroupIndex)
            {
                await tx.RollbackAsync(token);
                return new(ChangeStatus.Inconsistent);
            }
            await tx.CommitAsync(token);
            return new(ChangeStatus.Changed, Substitute: new SubstituteStateDto(memberId, clubId, isSubstitute));
        }
        catch (FbException error) when (IsLockConflict(error))
        {
            await tx.RollbackAsync(token);
            return new(ChangeStatus.ConcurrentChange);
        }
    }

    private static bool OppositeFirst(string one, string other) =>
        (one == "T" && other == "F") || (one == "F" && other == "T");

    private static bool IsLockConflict(FbException error) =>
        error.SQLSTATE == "40001" || error.Message.Contains("lock conflict", StringComparison.OrdinalIgnoreCase);
}
