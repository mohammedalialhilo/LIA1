using System.ComponentModel.DataAnnotations;

namespace DBF_BridgeClubs_REST_MSSQL.Models;

public sealed class CreateClubMemberDto
{
    [Required, StringLength(40)]
    public string Name { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int? MemberNo { get; set; }

    [StringLength(40)] public string? Address1 { get; set; }
    [StringLength(40)] public string? Address2 { get; set; }
    [StringLength(5)] public string? CountryCode { get; set; }
    [StringLength(10)] public string? ZipCode { get; set; }
    [StringLength(20)] public string? City { get; set; }
    [StringLength(20)] public string? Phone1 { get; set; }
    [StringLength(20)] public string? Phone2 { get; set; }
    [StringLength(20)] public string? Phone3 { get; set; }
    [StringLength(40), EmailAddress] public string? Email { get; set; }
    public DateOnly? ClubStart { get; set; }
}

// Omitted properties are unchanged; explicit null clears optional fields.
public sealed class UpdateClubMemberDto : IValidatableObject
{
    public OptionalString Name { get; set; }
    public OptionalString Address1 { get; set; }
    public OptionalString Address2 { get; set; }
    public OptionalString CountryCode { get; set; }
    public OptionalString ZipCode { get; set; }
    public OptionalString City { get; set; }
    public OptionalString Phone1 { get; set; }
    public OptionalString Phone2 { get; set; }
    public OptionalString Phone3 { get; set; }
    public OptionalString Email { get; set; }
    public OptionalDate ClubStart { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!new[] { Name, Address1, Address2, CountryCode, ZipCode, City,
                     Phone1, Phone2, Phone3, Email }.Any(field => field.IsSpecified) &&
            !ClubStart.IsSpecified)
            yield return new ValidationResult("Angiv mindst ét felt, der skal ændres.");
        if (Name.IsSpecified && string.IsNullOrWhiteSpace(Name.Value))
            yield return new ValidationResult("Navn må ikke være tomt.", [nameof(Name)]);
        foreach (var (field, max, name) in new[]
        {
            (Name, 40, nameof(Name)), (Address1, 40, nameof(Address1)),
            (Address2, 40, nameof(Address2)), (CountryCode, 5, nameof(CountryCode)),
            (ZipCode, 10, nameof(ZipCode)), (City, 20, nameof(City)),
            (Phone1, 20, nameof(Phone1)), (Phone2, 20, nameof(Phone2)),
            (Phone3, 20, nameof(Phone3)), (Email, 40, nameof(Email)),
        })
            if (field.IsSpecified && field.Value?.Length > max)
                yield return new ValidationResult($"{name} må højst være {max} tegn.", [name]);
        if (Email.IsSpecified && !string.IsNullOrWhiteSpace(Email.Value) &&
            !new EmailAddressAttribute().IsValid(Email.Value))
            yield return new ValidationResult("E-mailadressen er ugyldig.", [nameof(Email)]);
    }
}

public sealed class ClubMemberResponseDto
{
    public int MemberId { get; set; }
    public int ClubId { get; set; }
    public int? MemberNo { get; set; }
    public string? Name { get; set; }
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? CountryCode { get; set; }
    public string? ZipCode { get; set; }
    public string? City { get; set; }
    public string? Phone1 { get; set; }
    public string? Phone2 { get; set; }
    public string? Phone3 { get; set; }
    public string? Email { get; set; }
    public DateOnly? ClubStart { get; set; }
}

public sealed class AddExistingMemberDto
{
    [Range(1, int.MaxValue)]
    public int MemberId { get; set; }
}

public sealed class MemberClubLinkResponseDto
{
    public int MemberClubId { get; set; }
    public int MemberId { get; set; }
    public int ClubId { get; set; }
}

public sealed class ExistingMemberSearchResultDto
{
    public int MemberId { get; set; }
    public int? MemberNo { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool AlreadyAssigned { get; set; }
    public List<ExistingMemberSubclubDto> Subclubs { get; set; } = [];
}

public sealed class ExistingMemberSubclubDto
{
    public int ClubId { get; set; }
    public string ClubName { get; set; } = string.Empty;
}

public sealed class TransferClubMemberDto
{
    [Range(1, int.MaxValue)]
    public int DestinationClubId { get; set; }
}
