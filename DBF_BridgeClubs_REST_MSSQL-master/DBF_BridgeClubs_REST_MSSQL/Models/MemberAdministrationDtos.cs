using System.ComponentModel.DataAnnotations;

namespace DBF_BridgeClubs_REST_MSSQL.Models;

public sealed record FeeCategoryDto(int Code, string Name);
public sealed record MemberAdministrationDto(
    int MemberId, int? FeeCategoryCode, string FeeCategoryName,
    DateOnly? ClubStart, DateTime? StatusChanged, string? LastChangedBy);
public sealed record MemberHistoryEntryDto(
    int LogId, DateTime At, string? Actor, int Code,
    string? Text1, string? Text2, string? Value1, string? Value2);

public sealed class SetFeeCategoryDto
{
    [Range(2, 4)] public int Code { get; set; }
    [Range(2, 4)] public int ExpectedCode { get; set; }
}
