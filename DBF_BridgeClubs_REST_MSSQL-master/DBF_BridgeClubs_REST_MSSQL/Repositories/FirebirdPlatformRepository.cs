using System.Data;
using BridgeTourneringLib;
using DBF_BridgeClubs_Lib.Models;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

/// <summary>Reads the local BC3 demo database without requiring a SQL Server import.</summary>
public sealed class FirebirdPlatformRepository
{
    private static string ConnectionString =>
        Environment.GetEnvironmentVariable("FIREBIRD_CONNECTION_STRING") ?? Secret.ConnectionString;

    public async Task<MainClub> GetMainClubAsync()
    {
        await using var connection = new FbConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new FbCommand("""
            SELECT MAINCLUB_ID, ORG_MAINCLUB_ID, ORG_CLUB_NO, LOCATION, NAME,
                   ADDRESS_1, ADDRESS_2, ZIP_CODE, CITY, PHONE_1, PHONE_2,
                   EMAIL, HOMEPAGE, SEASON_START
            FROM SYS_MAINCLUB
            """, connection);
        await using var reader = await command.ExecuteReaderAsync(CommandBehavior.SingleRow);
        if (!await reader.ReadAsync()) return new MainClub();
        return new MainClub
        {
            MainClubID = RequiredInt(reader, "MAINCLUB_ID"),
            OrgMainClubID = Int(reader, "ORG_MAINCLUB_ID"),
            OrgClubNo = Int(reader, "ORG_CLUB_NO"),
            Location = String(reader, "LOCATION"),
            Name = String(reader, "NAME"),
            Address1 = String(reader, "ADDRESS_1"),
            Address2 = String(reader, "ADDRESS_2"),
            ZipCode = String(reader, "ZIP_CODE"),
            City = String(reader, "CITY"),
            Phone1 = String(reader, "PHONE_1"),
            Phone2 = String(reader, "PHONE_2"),
            Email = String(reader, "EMAIL"),
            HomePage = String(reader, "HOMEPAGE"),
            SeasonStart = String(reader, "SEASON_START"),
        };
    }

    public async Task<List<SubClub>> GetSubClubsAsync()
    {
        var result = new List<SubClub>();
        await using var connection = new FbConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new FbCommand("""
            SELECT CLUB_ID, ORG_CLUB_ID, CLUB_NAME, LEADER_ID, GAME_DAY,
                   NO_SMOKING, IS_VISIBLE, LAST_CHANGED_BY, GAME_TIME
            FROM MEM_CLUB
            """, connection);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(new SubClub
            {
                ClubID = RequiredInt(reader, "CLUB_ID"),
                OrgCludID = Int(reader, "ORG_CLUB_ID"),
                ClubName = String(reader, "CLUB_NAME"),
                LeaderID = Int(reader, "LEADER_ID"),
                GameDay = Int(reader, "GAME_DAY"),
                NoSmoking = String(reader, "NO_SMOKING"),
                IsVisible = String(reader, "IS_VISIBLE"),
                LastChangedBy = String(reader, "LAST_CHANGED_BY"),
                GameTime = Time(reader, "GAME_TIME"),
            });
        }
        return result;
    }

    public async Task<List<Member>> GetMembersAsync()
    {
        var result = new List<Member>();
        await using var connection = new FbConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new FbCommand("""
            SELECT MEMBER_ID, MEMBER_NO, NAME, ADDRESS_1, ADDRESS_2,
                   COUNTRY_CODE, ZIP_CODE, CITY, PHONE_1, PHONE_2, PHONE_3,
                   EMAIL, CLUB_START, TOTAL_BRONZE, TOTAL_SILVER, TOTAL_GOLD,
                   TOTAL_MASTER
            FROM MEM_MEMBER
            """, connection);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(new Member
            {
                MemberID = RequiredInt(reader, "MEMBER_ID"),
                MemberNo = Int(reader, "MEMBER_NO"),
                Name = String(reader, "NAME"),
                Address1 = String(reader, "ADDRESS_1"),
                Address2 = String(reader, "ADDRESS_2"),
                CountryCode = String(reader, "COUNTRY_CODE"),
                ZipCode = String(reader, "ZIP_CODE"),
                City = String(reader, "CITY"),
                Phone1 = String(reader, "PHONE_1"),
                Phone2 = String(reader, "PHONE_2"),
                Phone3 = String(reader, "PHONE_3"),
                Email = String(reader, "EMAIL"),
                ClubStart = Date(reader, "CLUB_START"),
                TotalBronze = Double(reader, "TOTAL_BRONZE"),
                TotalSilver = Double(reader, "TOTAL_SILVER"),
                TotalGold = Double(reader, "TOTAL_GOLD"),
                TotalMaster = Double(reader, "TOTAL_MASTER"),
            });
        }
        return result;
    }

    public async Task<List<MemberClub>> GetMemberClubsAsync()
    {
        var result = new List<MemberClub>();
        await using var connection = new FbConnection(ConnectionString);
        await connection.OpenAsync();
        await using var command = new FbCommand("""
            SELECT MEMBER_CLUB_ID, MEMBER_ID, CLUB_ID, PARTNER_ID, PARTNER_FIRST,
                   IS_SUBSTITUTE, GROUP_INDEX, LAST_CHANGED_BY, LAST_CHANGED_DATE
            FROM MEM_MEMBER_CLUB
            """, connection);
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            result.Add(new MemberClub
            {
                MemberClubID = RequiredInt(reader, "MEMBER_CLUB_ID"),
                MemberID = Int(reader, "MEMBER_ID"),
                ClubID = Int(reader, "CLUB_ID"),
                PartnerID = Int(reader, "PARTNER_ID"),
                PartnerFirst = String(reader, "PARTNER_FIRST"),
                IsSubstitute = String(reader, "IS_SUBSTITUTE"),
                GroupIndex = Int(reader, "GROUP_INDEX"),
                LastChangedBy = String(reader, "LAST_CHANGED_BY"),
                LastChangedDate = DateTime(reader, "LAST_CHANGED_DATE"),
            });
        }
        return result;
    }

    private static object? Value(IDataRecord row, string name)
    {
        var index = row.GetOrdinal(name);
        return row.IsDBNull(index) ? null : row.GetValue(index);
    }

    private static int RequiredInt(IDataRecord row, string name) =>
        Convert.ToInt32(Value(row, name) ?? throw new DataException($"{name} is null."));
    private static int? Int(IDataRecord row, string name) =>
        Value(row, name) is { } value ? Convert.ToInt32(value) : null;
    private static string? String(IDataRecord row, string name) =>
        Value(row, name)?.ToString()?.TrimEnd();
    private static double? Double(IDataRecord row, string name) =>
        Value(row, name) is { } value ? Convert.ToDouble(value) : null;
    private static DateOnly? Date(IDataRecord row, string name) =>
        Value(row, name) is { } value ? DateOnly.FromDateTime(Convert.ToDateTime(value)) : null;
    private static DateTime? DateTime(IDataRecord row, string name) =>
        Value(row, name) is { } value ? Convert.ToDateTime(value) : null;
    private static TimeOnly? Time(IDataRecord row, string name) => Value(row, name) switch
    {
        TimeSpan value => TimeOnly.FromTimeSpan(value),
        System.DateTime value => TimeOnly.FromDateTime(value),
        null => null,
        var value => TimeOnly.Parse(value.ToString()!),
    };
}
