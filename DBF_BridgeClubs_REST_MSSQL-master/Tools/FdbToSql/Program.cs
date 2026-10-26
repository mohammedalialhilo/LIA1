using System.Data;
using BridgeTourneringLib;
using FirebirdSql.Data.FirebirdClient;
using Microsoft.Data.SqlClient;

// Standalone, read-only Firebird source -> SQL Server import. The existing API is not changed.
var inspectOnly = args.Length == 1 && args[0] == "--inspect";
if (args.Length != 0 && !inspectOnly)
{
    Console.Error.WriteLine("Usage: dotnet run --project Tools/FdbToSql -- [--inspect]");
    return 2;
}

var firebirdConnectionString = Environment.GetEnvironmentVariable("FIREBIRD_CONNECTION_STRING")
    ?? Secret.ConnectionString;
var sourceOptions = new FbConnectionStringBuilder(firebirdConnectionString);
var fileName = Path.GetFileNameWithoutExtension(sourceOptions.Database);
if (!int.TryParse(fileName, out var clubNo) || clubNo <= 0)
{
    Console.Error.WriteLine("The Firebird Database path must end in a numeric club name such as 9999.FDB.");
    return 2;
}

var schemaName = $"club{clubNo}";
var sqlConnectionString = Environment.GetEnvironmentVariable("MSSQL_CONNECTION_STRING");
if (!inspectOnly && string.IsNullOrWhiteSpace(sqlConnectionString))
{
    Console.Error.WriteLine("Set MSSQL_CONNECTION_STRING to the destination SQL Server database, or use --inspect.");
    return 2;
}

try
{
    using var firebird = new FbConnection(firebirdConnectionString);
    firebird.Open();
    var tables = ReadSourceTables(firebird);
    Console.WriteLine($"Firebird club {clubNo}: {tables.Count} tables found.");

    if (inspectOnly)
    {
        foreach (var table in tables)
        {
            using var columns = new FbCommand($"SELECT * FROM {QuoteFirebird(table)} WHERE 1 = 0", firebird);
            using (var metadata = columns.ExecuteReader())
            {
                for (var i = 0; i < metadata.FieldCount; i++)
                    _ = ToSqlType(metadata.GetFieldType(i));
            }
            using var count = new FbCommand($"SELECT COUNT(*) FROM {QuoteFirebird(table)}", firebird);
            Console.WriteLine($"{table}: {Convert.ToInt64(count.ExecuteScalar())} rows");
        }
        return 0;
    }

    using var sql = new SqlConnection(sqlConnectionString);
    sql.Open();
    using var transaction = sql.BeginTransaction();

    // Refuse to overwrite any existing destination table. DDL and inserts are one transaction.
    foreach (var table in tables)
    {
        using var exists = new SqlCommand("""
            SELECT COUNT(*) FROM sys.tables AS t
            JOIN sys.schemas AS s ON s.schema_id = t.schema_id
            WHERE s.name = @schema AND t.name = @table
            """, sql, transaction);
        exists.Parameters.AddWithValue("@schema", schemaName);
        exists.Parameters.AddWithValue("@table", table);
        if (Convert.ToInt32(exists.ExecuteScalar()) != 0)
            throw new InvalidOperationException($"Destination [{schemaName}].[{table}] already exists. No data was changed.");
    }

    using (var createSchema = new SqlCommand(
        $"IF SCHEMA_ID(N'{schemaName}') IS NULL EXEC(N'CREATE SCHEMA {QuoteSql(schemaName)}')", sql, transaction))
        createSchema.ExecuteNonQuery();

    foreach (var table in tables)
    {
        using var source = new FbCommand($"SELECT * FROM {QuoteFirebird(table)}", firebird);
        using var reader = source.ExecuteReader(CommandBehavior.SequentialAccess);
        var columns = Enumerable.Range(0, reader.FieldCount)
            .Select(i => (Name: reader.GetName(i), SqlType: ToSqlType(reader.GetFieldType(i))))
            .ToArray();
        if (columns.Length == 0)
            throw new InvalidOperationException($"Source table {table} has no columns.");

        var fullName = $"{QuoteSql(schemaName)}.{QuoteSql(table)}";
        var definitions = string.Join(", ", columns.Select(c => $"{QuoteSql(c.Name)} {c.SqlType} NULL"));
        using (var createTable = new SqlCommand($"CREATE TABLE {fullName} ({definitions})", sql, transaction))
            createTable.ExecuteNonQuery();

        using var bulkCopy = new SqlBulkCopy(sql, SqlBulkCopyOptions.Default, transaction)
        {
            DestinationTableName = fullName,
            BatchSize = 1000,
            BulkCopyTimeout = 300,
            EnableStreaming = true,
        };
        foreach (var column in columns)
            bulkCopy.ColumnMappings.Add(column.Name, column.Name);
        bulkCopy.WriteToServer(reader);

        using var count = new SqlCommand($"SELECT COUNT_BIG(*) FROM {fullName}", sql, transaction);
        Console.WriteLine($"{table}: {Convert.ToInt64(count.ExecuteScalar())} rows imported");
    }

    transaction.Commit();
    Console.WriteLine($"Import complete. The SQL Server schema is [{schemaName}].");
    return 0;
}
catch (Exception ex)
{
    // Do not print connection strings: provider exceptions can include credentials or server details.
    Console.Error.WriteLine($"Import failed ({ex.GetType().Name}). Check Firebird access, SQL Server access, and table types.");
    return 1;
}

static List<string> ReadSourceTables(FbConnection connection)
{
    using var command = new FbCommand("""
        SELECT TRIM(RDB$RELATION_NAME)
        FROM RDB$RELATIONS
        WHERE COALESCE(RDB$SYSTEM_FLAG, 0) = 0 AND RDB$VIEW_BLR IS NULL
        ORDER BY RDB$RELATION_NAME
        """, connection);
    using var reader = command.ExecuteReader();
    var tables = new List<string>();
    while (reader.Read())
        tables.Add(reader.GetString(0).Trim());
    if (tables.Count == 0)
        throw new InvalidOperationException("The Firebird database has no user tables.");
    return tables;
}

static string QuoteFirebird(string name) => $"\"{name.Replace("\"", "\"\"")}\"";
static string QuoteSql(string name) => $"[{name.Replace("]", "]]" )}]";

static string ToSqlType(Type type)
{
    if (type == typeof(string) || type == typeof(char)) return "nvarchar(max)";
    if (type == typeof(short) || type == typeof(byte) || type == typeof(sbyte)) return "smallint";
    if (type == typeof(int) || type == typeof(ushort)) return "int";
    if (type == typeof(long) || type == typeof(uint)) return "bigint";
    if (type == typeof(ulong)) return "decimal(20,0)";
    if (type == typeof(float) || type == typeof(double)) return "float";
    if (type == typeof(decimal)) return "decimal(38,18)";
    if (type == typeof(DateTime)) return "datetime2";
    if (type == typeof(DateOnly)) return "date";
    if (type == typeof(TimeSpan) || type == typeof(TimeOnly)) return "time";
    if (type == typeof(bool)) return "bit";
    if (type == typeof(Guid)) return "uniqueidentifier";
    if (type == typeof(byte[])) return "varbinary(max)";
    throw new NotSupportedException($"Cannot map Firebird type {type.FullName} to SQL Server.");
}
