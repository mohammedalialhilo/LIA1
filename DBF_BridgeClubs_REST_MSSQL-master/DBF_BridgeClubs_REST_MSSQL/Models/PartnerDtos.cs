using System.ComponentModel.DataAnnotations;

namespace DBF_BridgeClubs_REST_MSSQL.Models;

public sealed class SetPartnerDto
{
    [Range(1, int.MaxValue)] public int PartnerMemberId { get; set; }
    [Range(0, int.MaxValue)] public int ExpectedPartnerMemberId { get; set; } = -1;
}

public sealed class SetSubstituteStatusDto
{
    [Required] public bool? IsSubstitute { get; set; }
    [Required] public bool? ExpectedIsSubstitute { get; set; }
}

public sealed record PartnerStateDto(int MemberId, int ClubId, int? PartnerMemberId, string PartnerFirst);
public sealed record SubstituteStateDto(int MemberId, int ClubId, bool IsSubstitute);
public sealed record EligiblePartnerDto(int MemberId, int? MemberNo, string Name);
