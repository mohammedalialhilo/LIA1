using System.ComponentModel.DataAnnotations;
using DBF_BridgeClubs_REST_MSSQL.Models;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers;

[ApiController]
[EnableCors("allowAnything")]
[Route("api/Clubs/{fdbNo:int}/SubClubs/{clubId:int}")]
public sealed class ClubPartnershipsController(ClubPartnerRepository repository) : ControllerBase
{
    [HttpGet("Partnerships/{memberId:int}/Candidates")]
    public async Task<IActionResult> Candidates(int fdbNo, int clubId, int memberId,
        [FromQuery, StringLength(40)] string? query, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0) return BadRequest(new { code = "invalid_id" });
        if (!await repository.ClubExistsAsync(clubId, cancellationToken))
            return NotFound(new { code = "subclub_not_found", error = "Underklubben blev ikke fundet." });
        if (!await repository.MembershipExistsAsync(clubId, memberId, cancellationToken))
            return NotFound(new { code = "membership_not_found", error = "Medlemmet er ikke tilknyttet underklubben." });
        return Ok(await repository.EligibleAsync(clubId, memberId, query ?? "", cancellationToken));
    }

    [HttpGet("Substitutes")]
    public async Task<IActionResult> Substitutes(int fdbNo, int clubId,
        [FromQuery, StringLength(40)] string? query, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0) return BadRequest(new { code = "invalid_id" });
        if (!await repository.ClubExistsAsync(clubId, cancellationToken))
            return NotFound(new { code = "subclub_not_found", error = "Underklubben blev ikke fundet." });
        return Ok(await repository.SubstitutesAsync(clubId, query ?? "", cancellationToken));
    }

    [HttpPut("Partnerships/{memberId:int}")]
    public async Task<IActionResult> SetPartner(int fdbNo, int clubId, int memberId,
        [FromBody] SetPartnerDto input, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0) return BadRequest(new { code = "invalid_id" });
        var result = await repository.SetPartnerAsync(clubId, memberId, input.PartnerMemberId,
            input.ExpectedPartnerMemberId, cancellationToken);
        return result.Status == ClubPartnerRepository.ChangeStatus.Changed
            ? Ok(result.Partner) : ChangeError(result.Status);
    }

    [HttpDelete("Partnerships/{memberId:int}")]
    public async Task<IActionResult> RemovePartner(int fdbNo, int clubId, int memberId,
        [FromQuery] int? expectedPartnerMemberId,
        CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0) return BadRequest(new { code = "invalid_id" });
        if (expectedPartnerMemberId is null or <= 0)
            return BadRequest(new { code = "missing_expected_partner", error = "Angiv den nuværende makker." });
        var result = await repository.SetPartnerAsync(clubId, memberId, null,
            expectedPartnerMemberId.Value, cancellationToken);
        return result.Status == ClubPartnerRepository.ChangeStatus.Changed
            ? NoContent() : ChangeError(result.Status);
    }

    [HttpPut("Members/{memberId:int}/SubstituteStatus")]
    public async Task<IActionResult> SetSubstitute(int fdbNo, int clubId, int memberId,
        [FromBody] SetSubstituteStatusDto input, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0 || input.IsSubstitute is null || input.ExpectedIsSubstitute is null)
            return BadRequest(new { code = "invalid_status", error = "Vælg en gyldig substitutstatus." });
        var result = await repository.SetSubstituteAsync(clubId, memberId, input.IsSubstitute.Value,
            input.ExpectedIsSubstitute.Value, cancellationToken);
        return result.Status == ClubPartnerRepository.ChangeStatus.Changed
            ? Ok(result.Substitute) : ChangeError(result.Status);
    }

    private IActionResult ChangeError(ClubPartnerRepository.ChangeStatus status) => status switch
    {
        ClubPartnerRepository.ChangeStatus.ClubMissing =>
            NotFound(new { code = "subclub_not_found", error = "Underklubben blev ikke fundet." }),
        ClubPartnerRepository.ChangeStatus.MemberMissing =>
            NotFound(new { code = "member_not_found", error = "Medlemmet blev ikke fundet." }),
        ClubPartnerRepository.ChangeStatus.MembershipMissing =>
            NotFound(new { code = "membership_not_found", error = "Medlemmet er ikke tilknyttet underklubben." }),
        ClubPartnerRepository.ChangeStatus.PartnerMissing =>
            NotFound(new { code = "partner_not_in_subclub", error = "Makkeren blev ikke fundet i underklubben." }),
        ClubPartnerRepository.ChangeStatus.SelfPartner =>
            BadRequest(new { code = "self_partner", error = "Et medlem kan ikke være sin egen makker." }),
        ClubPartnerRepository.ChangeStatus.AlreadyPaired =>
            Conflict(new { code = "already_paired", error = "Makkerrelationen er allerede registreret eller fjernet." }),
        ClubPartnerRepository.ChangeStatus.PartnerBusy =>
            Conflict(new { code = "partner_busy", error = "Den valgte makker har allerede en fast makker eller en ugyldig relation." }),
        ClubPartnerRepository.ChangeStatus.GroupAssigned =>
            Conflict(new { code = "group_assigned", error = "Fjern gruppetilknytningen i BC3 før makkerrelationen ændres." }),
        ClubPartnerRepository.ChangeStatus.InvalidSubstituteValue =>
            Conflict(new { code = "invalid_stored_status", error = "Den gemte substitutstatus er ukendt og kan ikke ændres sikkert." }),
        ClubPartnerRepository.ChangeStatus.Inconsistent =>
            Conflict(new { code = "inconsistent_partnership", error = "Makkerrelationen er ufuldstændig. Kontrollér den i BC3 før ændring." }),
        _ => Conflict(new { code = "concurrent_change", error = "Medlemskabet blev ændret undervejs. Opdatér og prøv igen." }),
    };
}
