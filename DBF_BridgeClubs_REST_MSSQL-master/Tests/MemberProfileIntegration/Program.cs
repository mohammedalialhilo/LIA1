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
    ?? throw new InvalidOperationException("Set BC3_TEST_DATABASE to an offline test database.");
var apiDll = Environment.GetEnvironmentVariable("BC3_TEST_API_DLL")
    ?? throw new InvalidOperationException("Set BC3_TEST_API_DLL to the built API DLL.");
if (!File.Exists(source) || !File.Exists(apiDll)) throw new FileNotFoundException("Test input missing.");
var scratch = Path.Combine(Path.GetTempPath(), $"bc3-profile-test-{Guid.NewGuid():N}");
Directory.CreateDirectory(scratch);
var database = Path.Combine(scratch, "9999.FDB");
File.Copy(source, database);
var options = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = database };
await using var db = new FbConnection(options.ToString());
await db.OpenAsync();

static void Check(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

async Task<string> Hash(string table)
{
    await using var command = new FbCommand($"SELECT * FROM {table} ORDER BY 1", db);
    await using var reader = await command.ExecuteReaderAsync();
    var contents = new StringBuilder();
    while (await reader.ReadAsync())
    {
        for (var i = 0; i < reader.FieldCount; i++)
            contents.Append(reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()).Append('|');
        contents.AppendLine();
    }
    return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(contents.ToString())));
}

async Task<string> Snapshot(string table, string idColumn, int id)
{
    await using var command = new FbCommand($"SELECT * FROM {table} WHERE {idColumn}=@id", db);
    command.Parameters.AddWithValue("@id", id);
    await using var reader = await command.ExecuteReaderAsync();
    Check(await reader.ReadAsync(), "Snapshot row missing.");
    return string.Join("|", Enumerable.Range(0, reader.FieldCount)
        .Select(i => reader.IsDBNull(i) ? "<null>" : reader.GetValue(i).ToString()));
}

var historicalTables = new[] { "SECTIONPLAYER", "MAINTOURNAMENTPLAYER", "HACROUNDPLAYER", "MASTERPOINTS", "RESULT" };
var before = new Dictionary<string, string>();
foreach (var table in historicalTables) before[table] = await Hash(table);
await using var clubCommand = new FbCommand("SELECT FIRST 1 CLUB_ID FROM MEM_CLUB ORDER BY CLUB_ID", db);
var clubId = Convert.ToInt32(await clubCommand.ExecuteScalarAsync());
await using var categoryCommand = new FbCommand("""
    SELECT FIRST 1 MEMBER_ID FROM MEM_MEMBER WHERE STATUS = 2 ORDER BY MEMBER_ID
    """, db);
var categoryMemberId = Convert.ToInt32(await categoryCommand.ExecuteScalarAsync());
await using var linkCommand = new FbCommand("""
    SELECT FIRST 1 MEMBER_CLUB_ID FROM MEM_MEMBER_CLUB WHERE MEMBER_ID=@id
    """, db);
linkCommand.Parameters.AddWithValue("@id", categoryMemberId);
var categoryLinkId = Convert.ToInt32(await linkCommand.ExecuteScalarAsync());
var categoryLinkBefore = await Snapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", categoryLinkId);

using var socket = new TcpListener(IPAddress.Loopback, 0);
socket.Start();
var port = ((IPEndPoint)socket.LocalEndpoint).Port;
socket.Stop();
var start = new ProcessStartInfo("dotnet") { UseShellExecute = false, CreateNoWindow = true };
start.ArgumentList.Add(apiDll);
start.Environment["ASPNETCORE_URLS"] = $"http://127.0.0.1:{port}";
start.Environment["FIREBIRD_CONNECTION_STRING"] = options.ToString();
start.Environment["Logging__LogLevel__Default"] = "Error";
using var process = Process.Start(start) ?? throw new InvalidOperationException("API did not start.");
using var http = new HttpClient { BaseAddress = new Uri($"http://127.0.0.1:{port}"), Timeout = TimeSpan.FromSeconds(30) };
string Member(int id) => $"/api/Clubs/9999/SubClubs/{clubId}/Members/{id}";
string Administration(int id) => $"/api/Clubs/9999/Members/{id}/Administration";

async Task<JsonDocument> Read(HttpResponseMessage response)
{
    Check(response.IsSuccessStatusCode, $"HTTP {(int)response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
    return JsonDocument.Parse(await response.Content.ReadAsStringAsync());
}

try
{
    for (var attempt = 0; attempt < 60; attempt++)
    {
        if (process.HasExited) throw new InvalidOperationException("API exited during startup.");
        try
        {
            using var ready = await http.GetAsync($"/api/Clubs/9999/SubClubs/{clubId}/Members");
            if (ready.IsSuccessStatusCode) break;
        }
        catch (HttpRequestException) { }
        if (attempt == 59) throw new InvalidOperationException("API did not become ready.");
        await Task.Delay(250);
    }

    using var created = await http.PostAsJsonAsync($"/api/Clubs/9999/SubClubs/{clubId}/Members",
        new { name = "Åse; \"Test\"", city = "København" });
    Check(created.StatusCode == HttpStatusCode.Created, "Could not create fixture.");
    using var createdJson = await Read(created);
    var memberId = createdJson.RootElement.GetProperty("memberId").GetInt32();

    using (var edited = await http.PutAsJsonAsync(Member(memberId), new
    {
        name = "Åse; \"Redigeret\"", address1 = "Søvej 12", address2 = "2. sal",
        zipCode = "3460", city = "Birkerød", countryCode = "DK",
        phone1 = "11111111", phone2 = "22222222", phone3 = "33333333",
        email = "aase@example.dk", clubStart = "2026-09-01"
    }))
    {
        using var json = await Read(edited);
        Check(json.RootElement.GetProperty("address2").GetString() == "2. sal" &&
              json.RootElement.GetProperty("phone3").GetString() == "33333333" &&
              json.RootElement.GetProperty("clubStart").GetString() == "2026-09-01",
            "Full edit did not persist.");
    }
    using (var clear = await http.PutAsJsonAsync(Member(memberId), new
    {
        address2 = (string?)null, phone2 = (string?)null, phone3 = (string?)null,
        email = (string?)null, clubStart = (string?)null
    }))
    {
        using var json = await Read(clear);
        Check(json.RootElement.GetProperty("address2").ValueKind == JsonValueKind.Null &&
              json.RootElement.GetProperty("phone2").ValueKind == JsonValueKind.Null &&
              json.RootElement.GetProperty("phone3").ValueKind == JsonValueKind.Null &&
              json.RootElement.GetProperty("email").ValueKind == JsonValueKind.Null &&
              json.RootElement.GetProperty("clubStart").ValueKind == JsonValueKind.Null &&
              json.RootElement.GetProperty("address1").GetString() == "Søvej 12",
            "Explicit clears or unchanged fields were not handled correctly.");
    }
    using (var invalidLength = await http.PutAsJsonAsync(Member(memberId), new { address1 = new string('X', 41) }))
        Check(invalidLength.StatusCode == HttpStatusCode.BadRequest, "Overlong field was accepted.");
    using (var invalidEmail = await http.PutAsJsonAsync(Member(memberId), new { email = "not-an-email" }))
        Check(invalidEmail.StatusCode == HttpStatusCode.BadRequest, "Invalid email was accepted.");
    using (var invalidName = await http.PutAsJsonAsync(Member(memberId), new { name = (string?)null }))
        Check(invalidName.StatusCode == HttpStatusCode.BadRequest, "Clearing the name was accepted.");
    using (var invalidDate = await http.PutAsJsonAsync(Member(memberId), new { clubStart = "not-a-date" }))
        Check(invalidDate.StatusCode == HttpStatusCode.BadRequest, "Invalid date was accepted.");
    using (var reloaded = await http.GetAsync(Member(memberId)))
    {
        using var json = await Read(reloaded);
        Check(json.RootElement.GetProperty("name").GetString() == "Åse; \"Redigeret\"" &&
              json.RootElement.GetProperty("address1").GetString() == "Søvej 12" &&
              json.RootElement.GetProperty("email").ValueKind == JsonValueKind.Null,
            "Saved member did not reload correctly.");
    }

    using (var categories = await http.GetAsync("/api/Clubs/9999/Members/FeeCategories"))
    {
        using var json = await Read(categories);
        Check(json.RootElement.GetArrayLength() == 3, "Verified fee categories were not returned.");
    }
    using (var administration = await http.GetAsync(Administration(categoryMemberId)))
    {
        using var json = await Read(administration);
        Check(json.RootElement.GetProperty("feeCategoryCode").GetInt32() == 2,
            "Existing fee category was not read correctly.");
    }
    using (var changed = await http.PutAsJsonAsync($"/api/Clubs/9999/Members/{categoryMemberId}/FeeCategory",
               new { code = 3, expectedCode = 2 }))
    {
        using var json = await Read(changed);
        Check(json.RootElement.GetProperty("feeCategoryCode").GetInt32() == 3,
            "Fee category change did not persist.");
    }
    using (var stale = await http.PutAsJsonAsync($"/api/Clubs/9999/Members/{categoryMemberId}/FeeCategory",
               new { code = 4, expectedCode = 2 }))
        Check(stale.StatusCode == HttpStatusCode.Conflict, "Stale category edit was accepted.");
    using (var unsafeCode = await http.PutAsJsonAsync($"/api/Clubs/9999/Members/{categoryMemberId}/FeeCategory",
               new { code = 0, expectedCode = 3 }))
        Check(unsafeCode.StatusCode == HttpStatusCode.BadRequest, "Unsafe category code was accepted.");
    Check(await Snapshot("MEM_MEMBER_CLUB", "MEMBER_CLUB_ID", categoryLinkId) == categoryLinkBefore,
        "Category change altered a subclub membership.");

    var searchUrl = $"/api/Clubs/9999/Members/Search?query={Uri.EscapeDataString("Åse")}" +
        $"&city={Uri.EscapeDataString("Birkerød")}&subclubId={clubId}&hasPartner=false&isSubstitute=false&page=1&pageSize=1";
    using (var search = await http.GetAsync(searchUrl))
    {
        using var json = await Read(search);
        Check(json.RootElement.GetProperty("total").GetInt32() == 1 &&
              json.RootElement.GetProperty("items")[0].GetProperty("memberId").GetInt32() == memberId,
            "Combined search and pagination did not find the fixture.");
    }
    using (var nextPage = await http.GetAsync(searchUrl.Replace("page=1", "page=2")))
    {
        using var json = await Read(nextPage);
        Check(json.RootElement.GetProperty("total").GetInt32() == 1 &&
              json.RootElement.GetProperty("items").GetArrayLength() == 0,
            "Pagination returned a duplicate item on the next page.");
    }
    using (var excludedByDate = await http.GetAsync(
               $"/api/Clubs/9999/Members/Search?query={Uri.EscapeDataString("Åse")}&startFrom=2026-09-01"))
    {
        using var json = await Read(excludedByDate);
        Check(json.RootElement.GetProperty("total").GetInt32() == 0,
            "Club start date filter included the fixture after its date was cleared.");
    }
    using (var reset = await http.GetAsync("/api/Clubs/9999/Members/Search"))
    {
        using var json = await Read(reset);
        Check(json.RootElement.GetProperty("total").GetInt32() > 1,
            "Resetting all filters did not restore the member list.");
    }
    using (var invalidFilter = await http.GetAsync("/api/Clubs/9999/Members/Search?hasPartner=true"))
        Check(invalidFilter.StatusCode == HttpStatusCode.BadRequest,
            "Partner filter without a subclub was accepted.");
    using (var export = await http.GetAsync($"/api/Clubs/9999/Members/Export?query={Uri.EscapeDataString("Åse")}"))
    {
        Check(export.StatusCode == HttpStatusCode.OK, "CSV export failed.");
        var bytes = await export.Content.ReadAsByteArrayAsync();
        Check(bytes.Take(3).SequenceEqual(Encoding.UTF8.GetPreamble()), "CSV lacks UTF-8 BOM.");
        var text = Encoding.UTF8.GetString(bytes);
        Check(text.Contains("\"Åse; \"\"Redigeret\"\"\"") && !text.Contains("Anders And"),
            "CSV escaping or filtered export failed.");
    }
    using (var history = await http.GetAsync($"/api/Clubs/9999/Members/{memberId}/History"))
    {
        using var json = await Read(history);
        Check(json.RootElement.EnumerateArray().Any(entry => entry.GetProperty("code").GetInt32() == 2),
            "Real name-change audit entry was not returned.");
    }
    using (var categoryHistory = await http.GetAsync($"/api/Clubs/9999/Members/{categoryMemberId}/History"))
    {
        using var json = await Read(categoryHistory);
        Check(json.RootElement.EnumerateArray().Any(entry => entry.GetProperty("code").GetInt32() == 17),
            "Fee category audit entry was not returned.");
    }
    foreach (var table in historicalTables)
        Check(await Hash(table) == before[table], $"Historical table {table} changed.");
    Console.WriteLine("PASS: complete edit and clearing, validation, category transition, audit history, combined search, filtered UTF-8 CSV and historical preservation.");
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
