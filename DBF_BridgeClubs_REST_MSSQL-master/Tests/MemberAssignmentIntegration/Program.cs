using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;
using System.Text.Json;
using BridgeTourneringLib;
using FirebirdSql.Data.FirebirdClient;

var source = Environment.GetEnvironmentVariable("BC3_TEST_DATABASE")
    ?? throw new InvalidOperationException("Set BC3_TEST_DATABASE to an offline 9999.FDB test copy.");
var apiDll = Environment.GetEnvironmentVariable("BC3_TEST_API_DLL")
    ?? throw new InvalidOperationException("Set BC3_TEST_API_DLL to the built API assembly.");
if (!File.Exists(source) || !File.Exists(apiDll))
    throw new FileNotFoundException("The test database or API assembly is missing.");

var scratchDirectory = Path.Combine(Path.GetTempPath(), $"bc3-member-assignment-{Guid.NewGuid():N}");
Directory.CreateDirectory(scratchDirectory);
var scratchDatabase = Path.Combine(scratchDirectory, "9999.FDB");
File.Copy(source, scratchDatabase);
var options = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = scratchDatabase };

await using var db = new FbConnection(options.ToString());
await db.OpenAsync();

async Task<long> Count(string table)
{
    // All table names here are fixed test constants.
    await using var command = new FbCommand($"SELECT COUNT(*) FROM {table}", db);
    return Convert.ToInt64(await command.ExecuteScalarAsync());
}

async Task<List<(int MemberId, int SourceClubId, int DestinationClubId)>> AvailablePairs()
{
    var pairs = new List<(int, int, int)>();
    await using var command = new FbCommand("""
        SELECT FIRST 4 MC.MEMBER_ID, MC.CLUB_ID, C.CLUB_ID
        FROM MEM_MEMBER_CLUB MC JOIN MEM_CLUB C ON C.CLUB_ID <> MC.CLUB_ID
        WHERE NOT EXISTS (
            SELECT 1 FROM MEM_MEMBER_CLUB X
            WHERE X.MEMBER_ID = MC.MEMBER_ID AND X.CLUB_ID = C.CLUB_ID)
        ORDER BY MC.MEMBER_ID, C.CLUB_ID
        """, db);
    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync()) pairs.Add((reader.GetInt32(0), reader.GetInt32(1), reader.GetInt32(2)));
    return pairs;
}

async Task<string> MemberSnapshot(int memberId)
{
    await using var command = new FbCommand("""
        SELECT MEMBER_ID, MEMBER_NO, NAME, ADDRESS_1, ADDRESS_2, COUNTRY_CODE,
               ZIP_CODE, CITY, PHONE_1, PHONE_2, PHONE_3, EMAIL, CLUB_START,
               TOTAL_BRONZE, TOTAL_SILVER, TOTAL_GOLD, TOTAL_MASTER
        FROM MEM_MEMBER WHERE MEMBER_ID = @memberId
        """, db);
    command.Parameters.AddWithValue("@memberId", memberId);
    await using var reader = await command.ExecuteReaderAsync();
    Require(await reader.ReadAsync(), "The fixture member is missing.");
    return string.Join("|", Enumerable.Range(0, reader.FieldCount)
        .Select(i => reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()));
}

async Task<string> LinkSnapshot(int memberId, int clubId)
{
    await using var command = new FbCommand("""
        SELECT MEMBER_CLUB_ID, MEMBER_ID, CLUB_ID, PARTNER_ID, PARTNER_FIRST,
               IS_SUBSTITUTE, GROUP_INDEX, LAST_CHANGED_BY, LAST_CHANGED_DATE
        FROM MEM_MEMBER_CLUB WHERE MEMBER_ID = @memberId AND CLUB_ID = @clubId
        """, db);
    command.Parameters.AddWithValue("@memberId", memberId);
    command.Parameters.AddWithValue("@clubId", clubId);
    await using var reader = await command.ExecuteReaderAsync();
    Require(await reader.ReadAsync(), "The fixture membership is missing.");
    return string.Join("|", Enumerable.Range(0, reader.FieldCount)
        .Select(i => reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()));
}

static void Require(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

var pairs = await AvailablePairs();
Require(pairs.Count >= 2, "The test copy needs two unassigned member/subclub pairs.");
var first = pairs[0];
var second = pairs.First(pair => pair.MemberId != first.MemberId || pair.DestinationClubId != first.DestinationClubId);
var beforeMembers = await Count("MEM_MEMBER");
var beforeLinks = await Count("MEM_MEMBER_CLUB");
var beforeMember = await MemberSnapshot(first.MemberId);
var beforeExistingLink = await LinkSnapshot(first.MemberId, first.SourceClubId);

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

try
{
    var firstRoute = $"/api/Clubs/9999/SubClubs/{first.DestinationClubId}/Members";
    for (var attempt = 0; attempt < 60; attempt++)
    {
        if (process.HasExited) throw new InvalidOperationException("The API exited during startup.");
        try
        {
            if ((await http.GetAsync(firstRoute)).StatusCode == HttpStatusCode.OK) break;
        }
        catch (HttpRequestException) { }
        if (attempt == 59) throw new InvalidOperationException("The API did not become ready.");
        await Task.Delay(250);
    }

    var candidateNumber = await ScalarMemberNumber(first.MemberId);
    var search = await http.GetAsync($"{firstRoute}/Existing?query={candidateNumber}");
    Require(search.StatusCode == HttpStatusCode.OK, "Member search failed.");
    using (var searchBody = JsonDocument.Parse(await search.Content.ReadAsStringAsync()))
    {
        Require(searchBody.RootElement.EnumerateArray().Any(candidate =>
            candidate.GetProperty("memberId").GetInt32() == first.MemberId &&
            !candidate.GetProperty("alreadyAssigned").GetBoolean() &&
            candidate.GetProperty("subclubs").EnumerateArray().Any(club =>
                club.GetProperty("clubId").GetInt32() == first.SourceClubId)),
            "Search did not show the existing member and subclub context.");
    }
    var danishFixture = await DanishNameFixture();
    if (danishFixture is not { } danish)
        throw new InvalidOperationException("The test copy needs a member name with a Danish character.");
    using var danishSearch = await http.GetAsync(
        $"{firstRoute}/Existing?query={Uri.EscapeDataString(danish.Query)}");
    Require(danishSearch.StatusCode == HttpStatusCode.OK, "Danish name search failed.");
    using (var danishBody = JsonDocument.Parse(await danishSearch.Content.ReadAsStringAsync()))
    {
        Require(danishBody.RootElement.EnumerateArray().Any(candidate =>
            candidate.GetProperty("memberId").GetInt32() == danish.MemberId),
            "Danish characters did not match the member name.");
    }
    using var noMatch = await http.GetAsync($"{firstRoute}/Existing?query=CodexNoSuchMember123");
    using (var noMatchBody = JsonDocument.Parse(await noMatch.Content.ReadAsStringAsync()))
    {
        Require(noMatch.StatusCode == HttpStatusCode.OK && noMatchBody.RootElement.GetArrayLength() == 0,
            "Unmatched search did not return an empty list.");
    }

    using var created = await http.PostAsJsonAsync($"{firstRoute}/Existing", new { memberId = first.MemberId });
    Require(created.StatusCode == HttpStatusCode.Created, "Assignment did not return 201.");
    using var createdBody = JsonDocument.Parse(await created.Content.ReadAsStringAsync());
    var linkId = createdBody.RootElement.GetProperty("memberClubId").GetInt32();
    Require(linkId > 0, "The new relationship ID is missing.");
    Require(await Count("MEM_MEMBER") == beforeMembers, "Assignment created a person record.");
    Require(await Count("MEM_MEMBER_CLUB") == beforeLinks + 1, "Assignment did not create exactly one link.");
    Require(await MemberSnapshot(first.MemberId) == beforeMember, "The person record changed.");
    Require(await LinkSnapshot(first.MemberId, first.SourceClubId) == beforeExistingLink,
        "An existing membership or partnership changed.");
    Require(await NewLinkHasExpectedDefaults(linkId, first.MemberId, first.DestinationClubId),
        "The new membership defaults or keys are incorrect.");
    using var assignedSearch = await http.GetAsync($"{firstRoute}/Existing?query={candidateNumber}");
    using (var assignedBody = JsonDocument.Parse(await assignedSearch.Content.ReadAsStringAsync()))
    {
        Require(assignedBody.RootElement.EnumerateArray().Any(candidate =>
            candidate.GetProperty("memberId").GetInt32() == first.MemberId &&
            candidate.GetProperty("alreadyAssigned").GetBoolean()),
            "Search did not mark the new membership as already assigned.");
    }

    using var duplicate = await http.PostAsJsonAsync($"{firstRoute}/Existing", new { memberId = first.MemberId });
    Require(duplicate.StatusCode == HttpStatusCode.Conflict, "Duplicate assignment did not return 409.");
    using var unknownMember = await http.PostAsJsonAsync($"{firstRoute}/Existing", new { memberId = int.MaxValue });
    Require(unknownMember.StatusCode == HttpStatusCode.NotFound, "Unknown member did not return 404.");
    using var unknownClub = await http.PostAsJsonAsync(
        "/api/Clubs/9999/SubClubs/2147483647/Members/Existing", new { memberId = first.MemberId });
    Require(unknownClub.StatusCode == HttpStatusCode.NotFound, "Unknown subclub did not return 404.");
    using var wrongDatabase = await http.PostAsJsonAsync(
        $"/api/Clubs/1000/SubClubs/{first.DestinationClubId}/Members/Existing", new { memberId = first.MemberId });
    Require(wrongDatabase.StatusCode == HttpStatusCode.NotFound, "The club 9999 restriction was lost.");

    using var destinationGet = await http.GetAsync($"{firstRoute}/{first.MemberId}");
    Require(destinationGet.StatusCode == HttpStatusCode.OK, "The subclub member API did not show the link.");
    using var allLinks = await http.GetAsync("/api/Clubs/9999/MemberClubs");
    using var allLinksBody = JsonDocument.Parse(await allLinks.Content.ReadAsStringAsync());
    Require(allLinksBody.RootElement.EnumerateArray().Any(link =>
        link.GetProperty("memberClubID").GetInt32() == linkId),
        "The member profile API did not show the new relationship.");
    using var allMembers = await http.GetAsync("/api/Clubs/9999/Members");
    using var allMembersBody = JsonDocument.Parse(await allMembers.Content.ReadAsStringAsync());
    Require(allMembersBody.RootElement.GetArrayLength() == beforeMembers,
        "The global member API count increased.");

    var secondRoute = $"/api/Clubs/9999/SubClubs/{second.DestinationClubId}/Members/Existing";
    var concurrent = await Task.WhenAll(
        http.PostAsJsonAsync(secondRoute, new { memberId = second.MemberId }),
        http.PostAsJsonAsync(secondRoute, new { memberId = second.MemberId }));
    Require(concurrent.Count(response => response.StatusCode == HttpStatusCode.Created) == 1 &&
            concurrent.Count(response => response.StatusCode == HttpStatusCode.Conflict) == 1,
        "Concurrent requests did not resolve as one 201 and one 409.");
    foreach (var response in concurrent) response.Dispose();
    Require(await Count("MEM_MEMBER") == beforeMembers, "Concurrent requests created a person record.");
    Require(await Count("MEM_MEMBER_CLUB") == beforeLinks + 2,
        "Concurrent requests created duplicate relationships.");

    using var createdPerson = await http.PostAsJsonAsync(firstRoute, new { name = "Codex Fixture Person" });
    Require(createdPerson.StatusCode == HttpStatusCode.Created, "Existing create-member flow regressed.");
    using var personBody = JsonDocument.Parse(await createdPerson.Content.ReadAsStringAsync());
    var createdPersonId = personBody.RootElement.GetProperty("memberId").GetInt32();
    using var updatedPerson = await http.PutAsJsonAsync(
        $"{firstRoute}/{createdPersonId}", new { phone1 = "00000000" });
    Require(updatedPerson.StatusCode == HttpStatusCode.OK, "Existing edit-member flow regressed.");

    Console.WriteLine("PASS: name/number/Danish search, empty and assigned results, 201 assignment, 409 duplicate, 404 missing IDs, 9999 restriction, concurrent 201/409, unchanged member/partner data, both read APIs, unchanged member count, existing create/edit.");
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

async Task<int> ScalarMemberNumber(int memberId)
{
    await using var command = new FbCommand(
        "SELECT MEMBER_NO FROM MEM_MEMBER WHERE MEMBER_ID = @memberId", db);
    command.Parameters.AddWithValue("@memberId", memberId);
    var value = await command.ExecuteScalarAsync();
    Require(value is not null && value is not DBNull, "The fixture needs an official member number.");
    return Convert.ToInt32(value);
}

async Task<(int MemberId, string Query)?> DanishNameFixture()
{
    await using var command = new FbCommand("SELECT MEMBER_ID, NAME FROM MEM_MEMBER", db);
    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        if (reader.IsDBNull(1)) continue;
        var name = reader.GetString(1).TrimEnd();
        var index = name.IndexOfAny(['æ', 'ø', 'å', 'Æ', 'Ø', 'Å']);
        if (index < 0) continue;
        var startIndex = Math.Max(0, index - 1);
        return (reader.GetInt32(0), name.Substring(startIndex, Math.Min(3, name.Length - startIndex)));
    }
    return null;
}

async Task<bool> NewLinkHasExpectedDefaults(int linkId, int memberId, int clubId)
{
    await using var command = new FbCommand("""
        SELECT MEMBER_ID, CLUB_ID, PARTNER_ID, PARTNER_FIRST, IS_SUBSTITUTE, GROUP_INDEX
        FROM MEM_MEMBER_CLUB WHERE MEMBER_CLUB_ID = @linkId
        """, db);
    command.Parameters.AddWithValue("@linkId", linkId);
    await using var reader = await command.ExecuteReaderAsync();
    return await reader.ReadAsync() && reader.GetInt32(0) == memberId && reader.GetInt32(1) == clubId &&
           reader.IsDBNull(2) && reader.GetString(3).Trim() == "F" &&
           reader.GetString(4).Trim() == "F" && reader.GetInt16(5) == 0;
}
