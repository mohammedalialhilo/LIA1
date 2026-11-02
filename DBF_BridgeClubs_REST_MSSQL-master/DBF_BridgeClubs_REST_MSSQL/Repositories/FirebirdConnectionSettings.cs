using BridgeTourneringLib;
using FirebirdSql.Data.FirebirdClient;

namespace DBF_BridgeClubs_REST_MSSQL.Repositories;

internal static class FirebirdConnectionSettings
{
    internal static string ConnectionString
    {
        get
        {
            var configured = Environment.GetEnvironmentVariable("FIREBIRD_CONNECTION_STRING");
            if (!string.IsNullOrWhiteSpace(configured)) return configured;

            // In a local checkout, use the database beside the solution. Keep the
            // existing connection credentials and let an explicit override win.
            var database = FindCheckoutDatabase(AppContext.BaseDirectory);
            if (database is not null)
            {
                var builder = new FbConnectionStringBuilder(Secret.ConnectionString)
                {
                    Database = database,
                };
                return builder.ToString();
            }

            return Secret.ConnectionString;
        }
    }

    private static string? FindCheckoutDatabase(string baseDirectory)
    {
        for (var directory = new DirectoryInfo(baseDirectory);
                 directory is not null;
                 directory = directory.Parent)
        {
            if (!File.Exists(Path.Combine(directory.FullName, "DBF_BridgeClubs_REST_MSSQL.sln")))
                continue;
            var database = Path.Combine(directory.FullName, "Data", "9999.FDB");
            return File.Exists(database) ? database : null;
        }
        return null;
    }
}
