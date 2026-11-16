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
    ?? throw new InvalidOperationException("Set BC3_TEST_DATABASE to an offline database copy.");
var apiDll = Environment.GetEnvironmentVariable("BC3_TEST_API_DLL")
    ?? throw new InvalidOperationException("Set BC3_TEST_API_DLL to the built API DLL.");
if (!File.Exists(source) || !File.Exists(apiDll)) throw new FileNotFoundException("Test database or API DLL missing.");
var scratch = Path.Combine(Path.GetTempPath(), $"bc3-partner-test-{Guid.NewGuid():N}");
Directory.CreateDirectory(scratch);
var database = Path.Combine(scratch, "9999.FDB");
File.Copy(source, database);
var settings = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = database };
await using var db = new FbConnection(settings.ToString());
await db.OpenAsync();

static void Check(bool valid, string message)
{
    if (!valid) throw new InvalidOperationException(message);
}

async Task<string> History(string table)
{
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

async Task<(int Id, int Partner, string First, string Substitute)> Link(int clubId, int memberId)
{
    await using var command = new FbCommand("""
        SELECT MEMBER_CLUB_ID, PARTNER_ID, PARTNER_FIRST, IS_SUBSTITUTE FROM MEM_MEMBER_CLUB
        WHERE CLUB_ID=@clubId AND MEMBER_ID=@memberId
        """, db);
    command.Parameters.AddWithValue("@clubId", clubId);
    command.Parameters.AddWithValue("@memberId", memberId);
    await using var reader = await command.ExecuteReaderAsync();
    Check(await reader.ReadAsync(), "Fixture membership missing.");
    return (reader.GetInt32(0), reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
        reader.GetString(2).Trim(), reader.GetString(3).Trim());
}

async Task<int> Count(string table)
{
    await using var command = new FbCommand($"SELECT COUNT(*) FROM {table}", db);
    return Convert.ToInt32(await command.ExecuteScalarAsync());
}

var clubs = new List<int>();
await using (var command = new FbCommand("SELECT CLUB_ID FROM MEM_CLUB ORDER BY CLUB_ID", db))
await using (var reader = await command.ExecuteReaderAsync())
    while (await reader.ReadAsync()) clubs.Add(reader.GetInt32(0));
Check(clubs.Count >= 2, "Need two subclubs in the test copy.");
var firstClub = clubs[0];
var otherClub = clubs[1];
var historicalTables = new[] { "SECTIONPLAYER", "MAINTOURNAMENTPLAYER", "HACROUNDPLAYER", "MASTERPOINTS", "RESULT" };
var before = new Dictionary<string, string>();
foreach (var table in historicalTables) before[table] = await History(table);
var personsBefore = await Count("MEM_MEMBER");

using var socket = new TcpListener(IPAddress.Loopback, 0);
socket.Start();
var port = ((IPEndPoint)socket.LocalEndpoint).Port;
socket.Stop();
var processStart = new ProcessStartInfo("dotnet") { UseShellExecute = false, CreateNoWindow = true };
processStart.ArgumentList.Add(apiDll);
processStart.Environment["ASPNETCORE_URLS"] = $"http://127.0.0.1:{port}";
processStart.Environment["FIREBIRD_CONNECTION_STRING"] = settings.ToString();
processStart.Environment["Logging__LogLevel__Default"] = "Error";
using var process = Process.Start(processStart) ?? throw new InvalidOperationException("API did not start.");
using var http = new HttpClient { BaseAddress = new Uri($"http://127.0.0.1:{port}"), Timeout = TimeSpan.FromSeconds(30) };
string Base(int club) => $"/api/Clubs/9999/SubClubs/{club}";
string Partner(int club, int member) => $"{Base(club)}/Partnerships/{member}";
string Substitute(int club, int member) => $"{Base(club)}/Members/{member}/SubstituteStatus";
Task<HttpResponseMessage> Assign(int club, int member, int partner, int expected) =>
    http.PutAsJsonAsync(Partner(club, member),
        new { partnerMemberId = partner, expectedPartnerMemberId = expected });
Task<HttpResponseMessage> Remove(int club, int member, int expected) =>
    http.DeleteAsync($"{Partner(club, member)}?expectedPartnerMemberId={expected}");

async Task<int> Create(int club, string name)
{
    using var response = await http.PostAsJsonAsync($"{Base(club)}/Members", new { name });
    Check(response.StatusCode == HttpStatusCode.Created, "Fixture person creation failed.");
    using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return json.RootElement.GetProperty("memberId").GetInt32();
}

async Task<string?> Code(HttpResponseMessage response)
{
    using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return json.RootElement.TryGetProperty("code", out var code) ? code.GetString() : null;
}

try
{
    for (var attempt = 0; attempt < 60; attempt++)
    {
        if (process.HasExited) throw new InvalidOperationException("API exited during startup.");
        try
        {
            using var ready = await http.GetAsync($"{Base(firstClub)}/Members");
            if (ready.IsSuccessStatusCode) break;
        }
        catch (HttpRequestException) { }
        if (attempt == 59) throw new InvalidOperationException("API did not become ready.");
        await Task.Delay(250);
    }

    var a = await Create(firstClub, "Åse Testmakker");
    var b = await Create(firstClub, "Bjørn Testmakker");
    var c = await Create(firstClub, "Cecilie Testmakker");
    var d = await Create(firstClub, "Dorte Testmakker");
    var x = await Create(otherClub, "Xenia Testmakker");
    using (var linkOther = await http.PostAsJsonAsync($"{Base(otherClub)}/Members/Existing", new { memberId = d }))
        Check(linkOther.StatusCode == HttpStatusCode.Created, "Could not create unrelated subclub membership.");
    using (var unrelated = await Assign(otherClub, d, x, 0))
        Check(unrelated.StatusCode == HttpStatusCode.OK, "Could not create unrelated subclub partnership.");
    var otherD = await Link(otherClub, d);
    var otherX = await Link(otherClub, x);

    using (var candidates = await http.GetAsync($"{Partner(firstClub, a)}/Candidates?query=Bj%C3%B8rn"))
    {
        Check(candidates.StatusCode == HttpStatusCode.OK, "Eligible search failed.");
        using var json = JsonDocument.Parse(await candidates.Content.ReadAsStringAsync());
        Check(json.RootElement.EnumerateArray().Any(row => row.GetProperty("memberId").GetInt32() == b),
            "Danish search did not find the eligible member.");
    }
    using (var allCandidates = await http.GetAsync($"{Partner(firstClub, a)}/Candidates"))
    {
        using var json = JsonDocument.Parse(await allCandidates.Content.ReadAsStringAsync());
        Check(json.RootElement.EnumerateArray().Any(row => row.GetProperty("memberId").GetInt32() == b),
            "Unfiltered candidate list did not include an eligible member.");
    }
    using (var self = await Assign(firstClub, a, a, 0))
        Check(self.StatusCode == HttpStatusCode.BadRequest && await Code(self) == "self_partner", "Self partnership accepted.");
    using (var unknownClub = await Assign(int.MaxValue, a, b, 0))
        Check(unknownClub.StatusCode == HttpStatusCode.NotFound, "Unknown subclub accepted.");
    using (var unknownMember = await Assign(firstClub, int.MaxValue, b, 0))
        Check(unknownMember.StatusCode == HttpStatusCode.NotFound, "Unknown member accepted.");
    using (var otherSubclub = await Assign(firstClub, a, x, 0))
        Check(otherSubclub.StatusCode == HttpStatusCode.NotFound && await Code(otherSubclub) == "partner_not_in_subclub",
            "Cross-subclub partner accepted.");

    using (var assigned = await Assign(firstClub, a, b, 0))
        Check(assigned.StatusCode == HttpStatusCode.OK, "Partner assignment failed.");
    Check((await Link(firstClub, a)).Partner == b && (await Link(firstClub, b)).Partner == a,
        "BC3 trigger did not create reciprocal partner references.");
    Check((await Link(firstClub, a)).First == "T" && (await Link(firstClub, b)).First == "F",
        "Partner ordering was not complementary.");
    using (var duplicate = await Assign(firstClub, a, b, b))
        Check(duplicate.StatusCode == HttpStatusCode.Conflict && await Code(duplicate) == "already_paired",
            "Duplicate partnership accepted.");
    using (var stale = await Assign(firstClub, a, c, 0))
        Check(stale.StatusCode == HttpStatusCode.Conflict && await Code(stale) == "concurrent_change",
            "Stale partner change was accepted.");
    using (var busy = await Assign(firstClub, c, b, 0))
        Check(busy.StatusCode == HttpStatusCode.Conflict, "Busy partner accepted.");

    using (var changed = await Assign(firstClub, a, c, b))
        Check(changed.StatusCode == HttpStatusCode.OK, "Partner change failed.");
    Check((await Link(firstClub, a)).Partner == c && (await Link(firstClub, c)).Partner == a,
        "New partnership was not reciprocal.");
    Check((await Link(firstClub, b)).Partner == 0 && (await Link(firstClub, b)).First == "F",
        "Old partner was not released by BC3 trigger.");
    using (var removed = await Remove(firstClub, a, c))
        Check(removed.StatusCode == HttpStatusCode.NoContent, "Partner removal failed.");
    Check((await Link(firstClub, a)).Partner == 0 && (await Link(firstClub, c)).Partner == 0,
        "Partner removal left a reference.");

    using (var paired = await Assign(firstClub, b, c, 0))
        Check(paired.StatusCode == HttpStatusCode.OK, "Partner fixture for substitute test failed.");
    using (var invalid = await http.PutAsJsonAsync(Substitute(firstClub, b), new { isSubstitute = "maybe", expectedIsSubstitute = false }))
        Check(invalid.StatusCode == HttpStatusCode.BadRequest, "Invalid substitute value accepted.");
    using (var marked = await http.PutAsJsonAsync(Substitute(firstClub, b), new { isSubstitute = true, expectedIsSubstitute = false }))
        Check(marked.StatusCode == HttpStatusCode.OK, "Substitute status could not be set.");
    Check((await Link(firstClub, b)).Substitute == "T" && (await Link(firstClub, b)).Partner == c &&
          (await Link(firstClub, c)).Partner == b, "Substitute status altered the regular partnership.");
    using (var profile = await http.GetAsync("/api/Clubs/9999/MemberClubs"))
    {
        Check(profile.StatusCode == HttpStatusCode.OK, "Member profile relationship API failed.");
        using var json = JsonDocument.Parse(await profile.Content.ReadAsStringAsync());
        Check(json.RootElement.EnumerateArray().Any(row =>
            row.GetProperty("memberID").GetInt32() == b &&
            row.GetProperty("clubID").GetInt32() == firstClub &&
            row.GetProperty("partnerID").GetInt32() == c &&
            row.GetProperty("isSubstitute").GetString() == "T"),
            "Member profile API did not show the saved partner and substitute status.");
    }
    using (var staleStatus = await http.PutAsJsonAsync(Substitute(firstClub, b),
               new { isSubstitute = false, expectedIsSubstitute = false }))
        Check(staleStatus.StatusCode == HttpStatusCode.Conflict && await Code(staleStatus) == "concurrent_change",
            "Stale substitute status change was accepted.");
    using (var substitutes = await http.GetAsync($"{Base(firstClub)}/Substitutes?query=Bj%C3%B8rn"))
    {
        Check(substitutes.StatusCode == HttpStatusCode.OK, "Substitute search failed.");
        using var json = JsonDocument.Parse(await substitutes.Content.ReadAsStringAsync());
        Check(json.RootElement.EnumerateArray().Any(row => row.GetProperty("memberId").GetInt32() == b),
            "Marked substitute was absent from search.");
    }
    using (var allSubstitutes = await http.GetAsync($"{Base(firstClub)}/Substitutes"))
    {
        using var json = JsonDocument.Parse(await allSubstitutes.Content.ReadAsStringAsync());
        Check(json.RootElement.EnumerateArray().Any(row => row.GetProperty("memberId").GetInt32() == b),
            "Unfiltered substitute list did not include a marked member.");
    }
    using (var unmarked = await http.PutAsJsonAsync(Substitute(firstClub, b), new { isSubstitute = false, expectedIsSubstitute = true }))
        Check(unmarked.StatusCode == HttpStatusCode.OK, "Substitute status could not be removed.");
    Check((await Link(firstClub, b)).Substitute == "F" && (await Link(firstClub, b)).Partner == c,
        "Removing substitute status altered membership or partner.");

    await using (var group = new FbCommand("""
        UPDATE MEM_MEMBER_CLUB SET GROUP_INDEX = 1 WHERE CLUB_ID = @clubId AND MEMBER_ID = @memberId
        """, db))
    {
        group.Parameters.AddWithValue("@clubId", firstClub);
        group.Parameters.AddWithValue("@memberId", d);
        Check(await group.ExecuteNonQueryAsync() == 1, "Could not prepare grouped fixture.");
    }
    using (var grouped = await Assign(firstClub, d, a, 0))
        Check(grouped.StatusCode == HttpStatusCode.Conflict && await Code(grouped) == "group_assigned",
            "Grouped partnership was accepted.");
    await using (var dangling = new FbCommand("""
        UPDATE MEM_MEMBER_CLUB SET GROUP_INDEX = 0, PARTNER_ID = @unknown, PARTNER_FIRST = 'T'
        WHERE CLUB_ID = @clubId AND MEMBER_ID = @memberId
        """, db))
    {
        dangling.Parameters.AddWithValue("@unknown", int.MaxValue);
        dangling.Parameters.AddWithValue("@clubId", firstClub);
        dangling.Parameters.AddWithValue("@memberId", d);
        Check(await dangling.ExecuteNonQueryAsync() == 1, "Could not prepare dangling reference fixture.");
    }
    using (var inconsistent = await Assign(firstClub, d, a, int.MaxValue))
        Check(inconsistent.StatusCode == HttpStatusCode.Conflict && await Code(inconsistent) == "inconsistent_partnership",
            "Dangling partner reference was changed.");
    Check((await Link(firstClub, d)).Partner == int.MaxValue,
        "Rejected change modified a dangling partner reference.");

    using (var releaseB = await Remove(firstClub, b, c))
        Check(releaseB.StatusCode == HttpStatusCode.NoContent, "Could not release partner for race fixture.");
    var actualRace = await Task.WhenAll(
        Assign(firstClub, a, b, 0),
        Assign(firstClub, a, c, 0));
    Check(actualRace.Count(response => response.StatusCode == HttpStatusCode.OK) == 1 &&
          actualRace.Count(response => response.StatusCode == HttpStatusCode.Conflict) == 1,
        $"Concurrent partner statuses: {string.Join(", ", actualRace.Select(response => (int)response.StatusCode))}");
    foreach (var response in actualRace) response.Dispose();
    var winner = (await Link(firstClub, a)).Partner;
    Check(winner is > 0 && ((await Link(firstClub, winner)).Partner == a), "Concurrent change left a nonreciprocal pair.");
    Check((await Link(otherClub, d)) == otherD && (await Link(otherClub, x)) == otherX,
        "An unrelated subclub partnership changed.");
    Check(await Count("MEM_MEMBER") == personsBefore + 5, "A partner operation changed person records.");
    foreach (var table in historicalTables)
        Check(await History(table) == before[table], $"Historical table {table} changed.");
    Console.WriteLine("PASS: partner assignment/change/removal, reciprocal ordering, conflicts, Danish search, substitute flag T/F, concurrency, unrelated subclub and historical preservation.");
    Console.WriteLine($"Disposable database: {database}");
}
finally
{
    if (!process.HasExited)
    {
        process.Kill(entireProcessTree: true);
        await process.WaitForExitAsync();
    }
}
