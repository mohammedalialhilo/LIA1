using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using BridgeTourneringLib;
using FirebirdSql.Data.FirebirdClient;

var source = Environment.GetEnvironmentVariable("BC3_TEST_DATABASE")
    ?? throw new InvalidOperationException("Set BC3_TEST_DATABASE to an offline 9999.FDB test copy.");
var apiDll = Environment.GetEnvironmentVariable("BC3_TEST_API_DLL")
    ?? throw new InvalidOperationException("Set BC3_TEST_API_DLL to the built API assembly.");
if (!File.Exists(source) || !File.Exists(apiDll))
    throw new FileNotFoundException("The test database or API assembly is missing.");

var scratchDirectory = Path.Combine(Path.GetTempPath(), $"bc3-member-change-{Guid.NewGuid():N}");
Directory.CreateDirectory(scratchDirectory);
var scratchDatabase = Path.Combine(scratchDirectory, "9999.FDB");
File.Copy(source, scratchDatabase);
var options = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = scratchDatabase };

await using var db = new FbConnection(options.ToString());
await db.OpenAsync();

static void Require(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

async Task<long> Count(string table)
{
    // Table names are fixed test constants, never request input.
    await using var command = new FbCommand($"SELECT COUNT(*) FROM {table}", db);
    return Convert.ToInt64(await command.ExecuteScalarAsync());
}

async Task<string> RowSnapshot(string table, string idColumn, int id)
{
    // Table and column names are fixed test constants, never request input.
    await using var command = new FbCommand($"SELECT * FROM {table} WHERE {idColumn} = @id", db);
    command.Parameters.AddWithValue("@id", id);
    await using var reader = await command.ExecuteReaderAsync();
    Require(await reader.ReadAsync(), $"The test row is missing in {table}.");
    return string.Join("|", Enumerable.Range(0, reader.FieldCount)
        .Select(i => reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()));
}

async Task<(int LinkId, int? PartnerId)> Link(int memberId, int clubId)
{
    await using var command = new FbCommand("""
        SELECT MEMBER_CLUB_ID, PARTNER_ID FROM MEM_MEMBER_CLUB
        WHERE MEMBER_ID = @memberId AND CLUB_ID = @clubId
        """, db);
    command.Parameters.AddWithValue("@memberId", memberId);
    command.Parameters.AddWithValue("@clubId", clubId);
    await using var reader = await command.ExecuteReaderAsync();
    return await reader.ReadAsync()
        ? (reader.GetInt32(0), reader.IsDBNull(1) ? null : reader.GetInt32(1))
        : (0, null);
}

async Task<string> HistoryHash(string table)
{
    // These are the verified historical tables; the first column is their primary ID.
    await using var command = new FbCommand($"SELECT * FROM {table} ORDER BY 1", db);
    await using var reader = await command.ExecuteReaderAsync();
    var data = new StringBuilder();
    while (await reader.ReadAsync())
    {
        for (var i = 0; i < reader.FieldCount; i++)
            data.Append(reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()).Append('|');
        data.AppendLine();
    }
    return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(data.ToString())));
}

var clubs = new List<int>();
await using (var command = new FbCommand("SELECT CLUB_ID FROM MEM_CLUB ORDER BY CLUB_ID", db))
await using (var reader = await command.ExecuteReaderAsync())
    while (await reader.ReadAsync()) clubs.Add(reader.GetInt32(0));
Require(clubs.Count >= 2, "The test copy needs two subclubs.");
var sourceClub = clubs[0];
var destinationClub = clubs[1];
var historicalTables = new[] { "SECTIONPLAYER", "MAINTOURNAMENTPLAYER", "HACROUNDPLAYER", "MASTERPOINTS", "RESULT" };
var historyBefore = new Dictionary<string, string>();
foreach (var table in historicalTables) historyBefore[table] = await HistoryHash(table);
var personsBefore = await Count("MEM_MEMBER");
var auditBefore = await Count("SYS_LOG");

using var socket = new TcpListener(IPAddress.Loopback, 0);
socket.Start();
var port = ((IPEndPoint)socket.LocalEndpoint).Port;
socket.Stop();
var start = new ProcessStartInfo("dotnet") { UseShellExecute = false, CreateNoWindow = true };
start.ArgumentList.Add(apiDll);
start.Environment["ASPNETCORE_URLS"] = $"http://127.0.0.1:{port}";
start.Environment["FIREBIRD_CONNECTION_STRING"] = options.ToString();
start.Environment["Logging__LogLevel__Default"] = "Error";
using var process = Process.Start(start) ?? throw new InvalidOperationException("The API did not start.");
using var http = new HttpClient { BaseAddress = new Uri($"http://127.0.0.1:{port}"), Timeout = TimeSpan.FromSeconds(30) };

string Route(int clubId, int memberId) =>
    $"/api/Clubs/9999/SubClubs/{clubId}/Members/{memberId}";

async Task<int> CreateFixture(string name)
{
    using var response = await http.PostAsJsonAsync(
        $"/api/Clubs/9999/SubClubs/{sourceClub}/Members", new { name });
    Require(response.StatusCode == HttpStatusCode.Created, "Could not create the disposable fixture person.");
    using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return body.RootElement.GetProperty("memberId").GetInt32();
}

async Task<string?> ErrorCode(HttpResponseMessage response)
{
    using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return body.RootElement.TryGetProperty("code", out var code) ? code.GetString() : null;
}

try
{
    for (var attempt = 0; attempt < 60; attempt++)
    {
        if (process.HasExited) throw new InvalidOperationException("The API exited during startup.");
        try
        {
            if ((await http.GetAsync($"/api/Clubs/9999/SubClubs/{sourceClub}/Members")).StatusCode == HttpStatusCode.OK)
                break;
        }
        catch (HttpRequestException) { }
        if (attempt == 59) throw new InvalidOperationException("The API did not become ready.");
        await Task.Delay(250);
    }

    var removeMember = await CreateFixture("Codex Remove Fixture");
    var originalRemoveMember = await RowSnapshot("MEM_MEMBER", "MEMBER_ID", removeMember);
    var sourceLink = await Link(removeMember, sourceClub);
    Require(sourceLink.LinkId > 0, "Fixture source membership is missing.");
    using (var addOther = await http.PostAsJsonAsync(
               $"/api/Clubs/9999/SubClubs/{destinationClub}/Members/Existing", new { memberId = removeMember }))
        Require(addOther.StatusCode == HttpStatusCode.Created, "Could not create the unrelated fixture membership.");
    var otherLink = await Link(removeMember, destinationClub);
    var otherSnapshot = await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", otherLink.LinkId);
    var linksBeforeRemove = await Count("MEM_MEMBER_CLUB");

    using (var duplicateTransfer = await http.PostAsJsonAsync(
               $"{Route(sourceClub, removeMember)}/Transfer", new { destinationClubId = destinationClub }))
    {
        Require(duplicateTransfer.StatusCode == HttpStatusCode.Conflict &&
                await ErrorCode(duplicateTransfer) == "destination_already_linked",
            "Transfer to an existing membership was not rejected.");
    }
    Require((await Link(removeMember, sourceClub)).LinkId == sourceLink.LinkId,
        "Rejected transfer changed the source membership.");

    using (var removed = await http.DeleteAsync($"{Route(sourceClub, removeMember)}/Membership"))
        Require(removed.StatusCode == HttpStatusCode.NoContent, "Removal did not return 204.");
    Require((await Link(removeMember, sourceClub)).LinkId == 0, "Removal left the source membership.");
    Require(await Count("MEM_MEMBER_CLUB") == linksBeforeRemove - 1, "Removal affected another membership.");
    Require(await RowSnapshot("MEM_MEMBER", "MEMBER_ID", removeMember) == originalRemoveMember,
        "Removal changed the person record.");
    Require(await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", otherLink.LinkId) == otherSnapshot,
        "Removal changed the unrelated membership.");

    using (var missingMembership = await http.DeleteAsync($"{Route(sourceClub, removeMember)}/Membership"))
        Require(missingMembership.StatusCode == HttpStatusCode.NotFound &&
                await ErrorCode(missingMembership) == "membership_not_found",
            "Missing membership was not rejected.");
    using (var missingMember = await http.DeleteAsync($"{Route(sourceClub, int.MaxValue)}/Membership"))
        Require(missingMember.StatusCode == HttpStatusCode.NotFound &&
                await ErrorCode(missingMember) == "member_not_found",
            "Missing member was not rejected.");
    using (var missingClub = await http.DeleteAsync($"{Route(int.MaxValue, removeMember)}/Membership"))
        Require(missingClub.StatusCode == HttpStatusCode.NotFound &&
                await ErrorCode(missingClub) == "source_subclub_not_found",
            "Missing subclub was not rejected.");
    using (var missingTransferSource = await http.PostAsJsonAsync(
               $"{Route(sourceClub, removeMember)}/Transfer", new { destinationClubId = destinationClub }))
        Require(missingTransferSource.StatusCode == HttpStatusCode.NotFound &&
                await ErrorCode(missingTransferSource) == "membership_not_found",
            "Transfer without a source membership was not rejected.");
    using (var missingDestination = await http.PostAsJsonAsync(
               $"{Route(destinationClub, removeMember)}/Transfer", new { destinationClubId = int.MaxValue }))
        Require(missingDestination.StatusCode == HttpStatusCode.NotFound &&
                await ErrorCode(missingDestination) == "destination_subclub_not_found",
            "Unknown destination subclub was not rejected.");

    var transferMember = await CreateFixture("Codex Transfer Fixture");
    var transferPersonSnapshot = await RowSnapshot("MEM_MEMBER", "MEMBER_ID", transferMember);
    var transferSourceLink = await Link(transferMember, sourceClub);
    var linksBeforeTransfer = await Count("MEM_MEMBER_CLUB");
    using (var sameClub = await http.PostAsJsonAsync(
               $"{Route(sourceClub, transferMember)}/Transfer", new { destinationClubId = sourceClub }))
        Require(sameClub.StatusCode == HttpStatusCode.BadRequest, "Same-club transfer was not rejected.");
    using (var moved = await http.PostAsJsonAsync(
               $"{Route(sourceClub, transferMember)}/Transfer", new { destinationClubId = destinationClub }))
    {
        Require(moved.StatusCode == HttpStatusCode.OK, "Transfer did not return 200.");
        using var body = JsonDocument.Parse(await moved.Content.ReadAsStringAsync());
        Require(body.RootElement.GetProperty("memberClubId").GetInt32() == transferSourceLink.LinkId,
            "Transfer changed the relationship ID.");
    }
    Require((await Link(transferMember, sourceClub)).LinkId == 0, "Transfer left the source link.");
    Require((await Link(transferMember, destinationClub)).LinkId == transferSourceLink.LinkId,
        "Transfer did not move the existing link.");
    Require(await Count("MEM_MEMBER_CLUB") == linksBeforeTransfer, "Transfer changed the link count.");
    Require(await RowSnapshot("MEM_MEMBER", "MEMBER_ID", transferMember) == transferPersonSnapshot,
        "Transfer changed the person record.");
    Require(await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", otherLink.LinkId) == otherSnapshot,
        "Transfer changed an unrelated membership.");

    var paired = await PairedFixture();
    if (paired is not { } pair) throw new InvalidOperationException("The test copy needs a partnered membership.");
    var pairSnapshot = await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", pair.LinkId);
    var reverse = await Link(pair.PartnerId, pair.ClubId);
    var reverseSnapshot = await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", reverse.LinkId);
    using (var blockedRemoval = await http.DeleteAsync(
               $"{Route(pair.ClubId, pair.MemberId)}/Membership"))
        Require(blockedRemoval.StatusCode == HttpStatusCode.Conflict &&
                await ErrorCode(blockedRemoval) == "partner_attached",
            "Partnered removal was not blocked.");
    using (var blockedTransfer = await http.PostAsJsonAsync(
               $"{Route(pair.ClubId, pair.MemberId)}/Transfer",
               new { destinationClubId = pair.ClubId == sourceClub ? destinationClub : sourceClub }))
        Require(blockedTransfer.StatusCode == HttpStatusCode.Conflict &&
                await ErrorCode(blockedTransfer) == "partner_attached",
            "Partnered transfer was not blocked.");
    Require(await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", pair.LinkId) == pairSnapshot &&
            await RowSnapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", reverse.LinkId) == reverseSnapshot,
        "Blocked operation changed a partnership.");

    var groupedMember = await CreateFixture("Codex Grouped Fixture");
    await using (var markGrouped = new FbCommand("""
        UPDATE MEM_MEMBER_CLUB SET GROUP_INDEX = 1
        WHERE MEMBER_ID = @memberId AND CLUB_ID = @clubId
        """, db))
    {
        markGrouped.Parameters.AddWithValue("@memberId", groupedMember);
        markGrouped.Parameters.AddWithValue("@clubId", sourceClub);
        Require(await markGrouped.ExecuteNonQueryAsync() == 1, "Could not mark the disposable fixture as grouped.");
    }
    using (var groupedRemoval = await http.DeleteAsync($"{Route(sourceClub, groupedMember)}/Membership"))
        Require(groupedRemoval.StatusCode == HttpStatusCode.Conflict &&
                await ErrorCode(groupedRemoval) == "group_assigned", "Grouped removal was not blocked.");
    using (var groupedTransfer = await http.PostAsJsonAsync(
               $"{Route(sourceClub, groupedMember)}/Transfer", new { destinationClubId = destinationClub }))
        Require(groupedTransfer.StatusCode == HttpStatusCode.Conflict &&
                await ErrorCode(groupedTransfer) == "group_assigned", "Grouped transfer was not blocked.");
    Require((await Link(groupedMember, sourceClub)).LinkId > 0 &&
            (await Link(groupedMember, destinationClub)).LinkId == 0,
        "Blocked group operation changed memberships.");

    var raceRemoveMember = await CreateFixture("Codex Concurrent Remove Fixture");
    var removeRace = await Task.WhenAll(
        http.DeleteAsync($"{Route(sourceClub, raceRemoveMember)}/Membership"),
        http.DeleteAsync($"{Route(sourceClub, raceRemoveMember)}/Membership"));
    Require(removeRace.Count(response => response.StatusCode == HttpStatusCode.NoContent) == 1 &&
            removeRace.Count(response => response.StatusCode == HttpStatusCode.NotFound ||
                                         response.StatusCode == HttpStatusCode.Conflict) == 1,
        "Concurrent removal did not produce one success and one safe failure.");
    foreach (var response in removeRace) response.Dispose();

    var raceTransferMember = await CreateFixture("Codex Concurrent Transfer Fixture");
    var transferRace = await Task.WhenAll(
        http.PostAsJsonAsync($"{Route(sourceClub, raceTransferMember)}/Transfer",
            new { destinationClubId = destinationClub }),
        http.PostAsJsonAsync($"{Route(sourceClub, raceTransferMember)}/Transfer",
            new { destinationClubId = destinationClub }));
    Require(transferRace.Count(response => response.StatusCode == HttpStatusCode.OK) == 1 &&
            transferRace.Count(response => response.StatusCode == HttpStatusCode.NotFound ||
                                           response.StatusCode == HttpStatusCode.Conflict) == 1,
        $"Concurrent transfer statuses were {string.Join(", ", transferRace.Select(response => (int)response.StatusCode))}.");
    foreach (var response in transferRace) response.Dispose();
    Require((await Link(raceTransferMember, destinationClub)).LinkId > 0 &&
            (await Link(raceTransferMember, sourceClub)).LinkId == 0,
        "Concurrent transfer left inconsistent memberships.");

    using var subclubMembers = await http.GetAsync($"/api/Clubs/9999/SubClubs/{destinationClub}/Members");
    using var subclubBody = JsonDocument.Parse(await subclubMembers.Content.ReadAsStringAsync());
    Require(subclubBody.RootElement.EnumerateArray().Any(member =>
        member.GetProperty("memberId").GetInt32() == transferMember),
        "The destination member list did not refresh from the database.");
    using var globalLinks = await http.GetAsync("/api/Clubs/9999/MemberClubs");
    using var globalBody = JsonDocument.Parse(await globalLinks.Content.ReadAsStringAsync());
    Require(globalBody.RootElement.EnumerateArray().Any(link =>
        link.GetProperty("memberID").GetInt32() == transferMember &&
        link.GetProperty("clubID").GetInt32() == destinationClub),
        "The member profile API did not show the transferred subclub.");

    Require(await Count("MEM_MEMBER") == personsBefore + 5, "A change operation deleted or created a person.");
    Require(await Count("SYS_LOG") > auditBefore, "BC3 did not record membership changes in its log.");
    foreach (var table in historicalTables)
        Require(await HistoryHash(table) == historyBefore[table], $"Historical table {table} changed.");

    Console.WriteLine("PASS: removal, transfer, duplicate/unknown/same-club rejection, partner and group protection, concurrent requests, person and unrelated-link preservation, unchanged tournament tables, BC3 audit log and API views.");
    Console.WriteLine($"Disposable database: {scratchDatabase}");
}
finally
{
    if (!process.HasExited)
    {
        process.Kill(entireProcessTree: true);
        await process.WaitForExitAsync();
    }
}

async Task<(int LinkId, int MemberId, int ClubId, int PartnerId)?> PairedFixture()
{
    await using var command = new FbCommand("""
        SELECT FIRST 1 MEMBER_CLUB_ID, MEMBER_ID, CLUB_ID, PARTNER_ID
        FROM MEM_MEMBER_CLUB WHERE PARTNER_ID > 0 ORDER BY MEMBER_CLUB_ID
        """, db);
    await using var reader = await command.ExecuteReaderAsync();
    return await reader.ReadAsync()
        ? (reader.GetInt32(0), reader.GetInt32(1), reader.GetInt32(2), reader.GetInt32(3))
        : null;
}
