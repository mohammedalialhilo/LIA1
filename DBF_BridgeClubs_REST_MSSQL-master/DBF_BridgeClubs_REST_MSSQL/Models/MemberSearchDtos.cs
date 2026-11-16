using System.ComponentModel.DataAnnotations;

namespace DBF_BridgeClubs_REST_MSSQL.Models;

public sealed class MemberSearchQuery : IValidatableObject
{
    [StringLength(40)] public string? Query { get; set; }
    [StringLength(20)] public string? City { get; set; }
    [Range(1, int.MaxValue)] public int? SubclubId { get; set; }
    [Range(2, 4)] public int? FeeCategory { get; set; }
    public bool? IsSubstitute { get; set; }
    public bool? HasPartner { get; set; }
    public DateOnly? StartFrom { get; set; }
    public DateOnly? StartTo { get; set; }
    public string Sort { get; set; } = "name";
    public bool Descending { get; set; }
    [Range(1, 1000000)] public int Page { get; set; } = 1;
    [Range(1, 100)] public int PageSize { get; set; } = 25;

    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if ((IsSubstitute is not null || HasPartner is not null) && SubclubId is null)
            yield return new ValidationResult("Vælg en underklub for makker- eller substitutfilter.");
        if (StartFrom is { } from && StartTo is { } to && from > to)
            yield return new ValidationResult("Startdatoen skal være før slutdatoen.");
        if (Sort is not ("name" or "memberNo" or "city" or "clubStart"))
            yield return new ValidationResult("Ugyldig sortering.");
    }
}

public sealed record MemberSearchItemDto(
    int MemberId, int? MemberNo, string Name, string? City,
    string? Phone1, string? Email, DateOnly? ClubStart,
    int? FeeCategoryCode, string Subclubs);
public sealed record MemberSearchPageDto(int Total, int Page, int PageSize,
    List<MemberSearchItemDto> Items);
