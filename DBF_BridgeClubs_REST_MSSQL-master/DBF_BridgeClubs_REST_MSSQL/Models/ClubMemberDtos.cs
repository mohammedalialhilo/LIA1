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

// Omitted and null properties are both left unchanged by PUT. Send a non-null value to edit a field.
public sealed class UpdateClubMemberDto
{
    [StringLength(40)] public string? Name { get; set; }
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
