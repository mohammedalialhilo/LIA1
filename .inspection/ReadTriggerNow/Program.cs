using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Reflection;
using BridgeTourneringLib;
using DBF_BridgeClubs_REST_MSSQL.Models;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using FirebirdSql.Data.FirebirdClient;

if (args.Contains("--connection-test"))
{
    Environment.SetEnvironmentVariable("FIREBIRD_CONNECTION_STRING", null);
    var settings = typeof(ClubMemberRepository).Assembly.GetType("DBF_BridgeClubs_REST_MSSQL.Repositories.FirebirdConnectionSettings")
        ?? throw new InvalidOperationException("Connection settings were not found.");
    var method = settings.GetMethod("FindCheckoutDatabase", BindingFlags.Static | BindingFlags.NonPublic)
        ?? throw new InvalidOperationException("Checkout database resolver was not found.");
    var apiBase = Path.GetFullPath("DBF_BridgeClubs_REST_MSSQL-master/DBF_BridgeClubs_REST_MSSQL/bin/Debug/net9.0");
    var actual = (string?)method.Invoke(null, [apiBase]);
    var expected = Path.GetFullPath("DBF_BridgeClubs_REST_MSSQL-master/Data/9999.FDB");
    if (actual is null || !Path.GetFullPath(actual).Equals(expected, StringComparison.OrdinalIgnoreCase))
        throw new InvalidOperationException("Local database selection failed.");
    Console.WriteLine("Local checkout connection resolves to the workspace 9999.FDB.");
    return;
}

if (args.Contains("--http-test"))
{
    var testDatabase = Path.GetFullPath(".inspection/migration-test/9999.FDB");
    if (!testDatabase.Contains(Path.DirectorySeparatorChar + ".inspection" + Path.DirectorySeparatorChar) ||
        !File.Exists(testDatabase)) throw new InvalidOperationException("The test database is unavailable.");
    var testOptions = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = testDatabase };
    var api = Path.GetFullPath("DBF_BridgeClubs_REST_MSSQL-master/DBF_BridgeClubs_REST_MSSQL/bin/Debug/net9.0/DBF_BridgeClubs_REST_MSSQL.dll");
    var start = new ProcessStartInfo("dotnet") { UseShellExecute = false, CreateNoWindow = true };
    start.ArgumentList.Add(api);
    start.Environment["ASPNETCORE_URLS"] = "http://127.0.0.1:52787";
    start.Environment["FIREBIRD_CONNECTION_STRING"] = testOptions.ToString();
    start.Environment["Logging__LogLevel__Default"] = "Warning";
    using var process = Process.Start(start) ?? throw new InvalidOperationException("API did not start.");
    using var http = new HttpClient { BaseAddress = new Uri("http://127.0.0.1:52787"), Timeout = TimeSpan.FromSeconds(10) };
    const string route = "/api/Clubs/9999/SubClubs/1/Members";
    try
    {
        for (var i = 0; i < 40; i++)
        {
            try { if ((await http.GetAsync(route)).StatusCode == HttpStatusCode.OK) break; }
            catch (HttpRequestException) { }
            await Task.Delay(250);
        }
        using var create = await http.PostAsJsonAsync(route, new { name = "Codex HTTP Test" });
        if (create.StatusCode != HttpStatusCode.Created)
            throw new InvalidOperationException($"POST status was {(int)create.StatusCode}.");
        using var body = JsonDocument.Parse(await create.Content.ReadAsStringAsync());
        var id = body.RootElement.GetProperty("memberId").GetInt32();
        using var update = await http.PutAsJsonAsync($"{route}/{id}", new { address1 = "Codex HTTP Address" });
        if (update.StatusCode != HttpStatusCode.OK)
            throw new InvalidOperationException($"PUT status was {(int)update.StatusCode}.");
        using var get = await http.GetAsync($"{route}/{id}");
        using var updatedBody = JsonDocument.Parse(await get.Content.ReadAsStringAsync());
        if (get.StatusCode != HttpStatusCode.OK ||
            updatedBody.RootElement.GetProperty("address1").GetString() != "Codex HTTP Address" ||
            updatedBody.RootElement.GetProperty("clubId").GetInt32() != 1)
            throw new InvalidOperationException("GET did not return the saved member and membership.");
        Console.WriteLine("Test copy HTTP: POST 201, PUT 200, GET 200; saved address and club link verified, no key supplied.");
    }
    finally
    {
        if (!process.HasExited) { process.Kill(entireProcessTree: true); await process.WaitForExitAsync(); }
    }
    return;
}

if (args.Contains("--test-write"))
{
    var testDatabase = Path.GetFullPath(".inspection/migration-test/9999.FDB");
    if (!testDatabase.Contains(Path.DirectorySeparatorChar + ".inspection" + Path.DirectorySeparatorChar) ||
        !File.Exists(testDatabase)) throw new InvalidOperationException("The test database is unavailable.");
    var testOptions = new FbConnectionStringBuilder(Secret.ConnectionString) { Database = testDatabase };
    Environment.SetEnvironmentVariable("FIREBIRD_CONNECTION_STRING", testOptions.ToString());
    var repository = new ClubMemberRepository();
    var original = await repository.GetAsync(1, 1, CancellationToken.None)
        ?? throw new InvalidOperationException("Test member is unavailable.");
    if (original.Name is null || original.Address1 is null)
        throw new InvalidOperationException("Test member cannot be restored.");
    var changed = await repository.UpdateAsync(1, 1,
        new UpdateClubMemberDto { Name = "Codex Probe Person", Address1 = "Codex Test Address" },
        CancellationToken.None);
    if (changed?.Name != "Codex Probe Person" || changed.Address1 != "Codex Test Address")
        throw new InvalidOperationException("Update was not persisted in the test database.");
    var restored = await repository.UpdateAsync(1, 1,
        new UpdateClubMemberDto { Name = original.Name, Address1 = original.Address1 },
        CancellationToken.None);
    if (restored?.Name != original.Name || restored.Address1 != original.Address1)
        throw new InvalidOperationException("The test member was not restored.");
    Console.WriteLine("Test copy: name and address update persisted; original values restored.");

    var created = await repository.CreateAsync(1,
        new CreateClubMemberDto { Name = "Codex Temporary Member" }, CancellationToken.None);
    if (created.Member is null || created.Member.ClubId != 1 ||
        await repository.GetAsync(1, created.Member.MemberId, CancellationToken.None) is null)
        throw new InvalidOperationException("Create or membership persistence failed in the test database.");
    Console.WriteLine("Test copy: member creation and club membership persisted.");
    return;
}

var configured = new FbConnectionStringBuilder(Environment.GetEnvironmentVariable("FIREBIRD_CONNECTION_STRING") ?? Secret.ConnectionString);
Console.WriteLine($"configured database={configured.Database}");
var options = new FbConnectionStringBuilder(Environment.GetEnvironmentVariable("FIREBIRD_CONNECTION_STRING") ?? Secret.ConnectionString)
{
    Database = Path.GetFullPath("DBF_BridgeClubs_REST_MSSQL-master/Data/9999.FDB")
};
using var db = new FbConnection(options.ToString());
db.Open();
using var command = new FbCommand("""
    SELECT TRIM(RDB$TRIGGER_NAME), RDB$TRIGGER_INACTIVE, RDB$TRIGGER_SOURCE
    FROM RDB$TRIGGERS
    WHERE RDB$TRIGGER_NAME IN
        ('MEM_MEMBER_BI0', 'MEM_MEMBER_AI0', 'MEM_MEMBER_BU0', 'MEM_MEMBER_AU0',
         'MEM_MEMBER_CLUB_AI0', 'MEM_MEMBER_CLUB_AU0')
    ORDER BY RDB$TRIGGER_NAME
    """, db);
using var reader = command.ExecuteReader();
while (reader.Read())
{
    var source = reader.IsDBNull(2) ? "" : reader.GetString(2);
    Console.WriteLine($"{reader.GetString(0)} active={reader.GetInt16(1) == 0} UDF={source.Contains("ADDRESS_OK", StringComparison.OrdinalIgnoreCase) || source.Contains("GET_FIRST_NAME", StringComparison.OrdinalIgnoreCase) || source.Contains("GET_MATCH_CODE", StringComparison.OrdinalIgnoreCase)} chars={source.Length}");
    if (reader.GetString(0).StartsWith("MEM_MEMBER_")) Console.WriteLine(source);
}
