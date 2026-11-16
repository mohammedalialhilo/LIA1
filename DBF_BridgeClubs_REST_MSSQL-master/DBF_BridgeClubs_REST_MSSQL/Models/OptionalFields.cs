using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace DBF_BridgeClubs_REST_MSSQL.Models;

[JsonConverter(typeof(OptionalStringConverter))]
public readonly record struct OptionalString(bool IsSpecified, string? Value);

public sealed class OptionalStringConverter : JsonConverter<OptionalString>
{
    public override bool HandleNull => true;

    public override OptionalString Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
        reader.TokenType switch
        {
            JsonTokenType.Null => new(true, null),
            JsonTokenType.String => new(true, reader.GetString()),
            _ => throw new JsonException("Værdien skal være tekst eller null."),
        };

    public override void Write(Utf8JsonWriter writer, OptionalString value, JsonSerializerOptions options)
    {
        if (value.Value is null) writer.WriteNullValue();
        else writer.WriteStringValue(value.Value);
    }
}

[JsonConverter(typeof(OptionalDateConverter))]
public readonly record struct OptionalDate(bool IsSpecified, DateOnly? Value);

public sealed class OptionalDateConverter : JsonConverter<OptionalDate>
{
    public override bool HandleNull => true;

    public override OptionalDate Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Null) return new(true, null);
        if (reader.TokenType != JsonTokenType.String ||
            !DateOnly.TryParseExact(reader.GetString(), "yyyy-MM-dd", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var date))
            throw new JsonException("Datoen skal være ÅÅÅÅ-MM-DD eller null.");
        return new(true, date);
    }

    public override void Write(Utf8JsonWriter writer, OptionalDate value, JsonSerializerOptions options)
    {
        if (value.Value is { } date) writer.WriteStringValue(date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
        else writer.WriteNullValue();
    }
}
