using System.ComponentModel.DataAnnotations;
using DBF_BridgeClubs_REST_MSSQL.Models;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers;

[ApiController]
[EnableCors("allowAnything")]
[Route("api/Clubs/{fdbNo:int}/SubClubs/{clubId:int}/Members")]
public sealed class ClubMembersController(ClubMemberRepository repository) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(List<ClubMemberResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(int fdbNo, int clubId, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0 || !await repository.ClubExistsAsync(clubId, cancellationToken))
            return NotFound();
        return Ok(await repository.ListAsync(clubId, cancellationToken));
    }

    [HttpGet("{memberId:int}")]
    [ProducesResponseType(typeof(ClubMemberResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int fdbNo, int clubId, int memberId, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0 || memberId <= 0) return NotFound();
        var member = await repository.GetAsync(clubId, memberId, cancellationToken);
        return member is null ? NotFound() : Ok(member);
    }

    [HttpGet("Existing")]
    [ProducesResponseType(typeof(List<ExistingMemberSearchResultDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SearchExisting(
        int fdbNo, int clubId, [FromQuery, StringLength(40)] string? query, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0 || !await repository.ClubExistsAsync(clubId, cancellationToken))
            return NotFound();
        return Ok(await repository.SearchExistingAsync(clubId, query ?? string.Empty, cancellationToken));
    }

    [HttpPost("Existing")]
    [ProducesResponseType(typeof(MemberClubLinkResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddExisting(
        int fdbNo, int clubId, [FromBody] AddExistingMemberDto input, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0) return NotFound();
        var (status, link) = await repository.AddExistingAsync(clubId, input.MemberId, cancellationToken);
        return status switch
        {
            ClubMemberRepository.AddExistingStatus.ClubMissing => NotFound(new { error = "Subclub not found." }),
            ClubMemberRepository.AddExistingStatus.MemberMissing => NotFound(new { error = "Member not found." }),
            ClubMemberRepository.AddExistingStatus.AlreadyLinked => Conflict(new { error = "Member is already assigned to this subclub." }),
            _ => CreatedAtAction(nameof(Get), new { fdbNo, clubId, memberId = input.MemberId }, link),
        };
    }

    [HttpDelete("{memberId:int}/Membership")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RemoveMembership(
        int fdbNo, int clubId, int memberId, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0) return BadRequest(new { code = "invalid_id" });
        var result = await repository.ChangeMembershipAsync(clubId, memberId, null, cancellationToken);
        return result.Status == ClubMemberRepository.MembershipChangeStatus.Changed
            ? NoContent()
            : MembershipChangeError(result.Status);
    }

    [HttpPost("{memberId:int}/Transfer")]
    [ProducesResponseType(typeof(MemberClubLinkResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> TransferMembership(
        int fdbNo, int clubId, int memberId, [FromBody] TransferClubMemberDto input,
        CancellationToken cancellationToken)
    {
        if (fdbNo != 9999) return NotFound(new { code = "database_not_found" });
        if (clubId <= 0 || memberId <= 0) return BadRequest(new { code = "invalid_id" });
        if (clubId == input.DestinationClubId)
            return BadRequest(new { code = "same_subclub", error = "Vælg en anden underklub." });
        var result = await repository.ChangeMembershipAsync(
            clubId, memberId, input.DestinationClubId, cancellationToken);
        return result.Status == ClubMemberRepository.MembershipChangeStatus.Changed
            ? Ok(result.Link)
            : MembershipChangeError(result.Status);
    }

    private IActionResult MembershipChangeError(ClubMemberRepository.MembershipChangeStatus status) => status switch
    {
        ClubMemberRepository.MembershipChangeStatus.SourceClubMissing =>
            NotFound(new { code = "source_subclub_not_found", error = "Underklubben blev ikke fundet." }),
        ClubMemberRepository.MembershipChangeStatus.DestinationClubMissing =>
            NotFound(new { code = "destination_subclub_not_found", error = "Målunderklubben blev ikke fundet." }),
        ClubMemberRepository.MembershipChangeStatus.MemberMissing =>
            NotFound(new { code = "member_not_found", error = "Medlemmet blev ikke fundet." }),
        ClubMemberRepository.MembershipChangeStatus.MembershipMissing =>
            NotFound(new { code = "membership_not_found", error = "Medlemmet er ikke tilknyttet underklubben." }),
        ClubMemberRepository.MembershipChangeStatus.DestinationLinked =>
            Conflict(new { code = "destination_already_linked", error = "Medlemmet er allerede tilknyttet målunderklubben." }),
        ClubMemberRepository.MembershipChangeStatus.PartnerAttached =>
            Conflict(new { code = "partner_attached", error = "Medlemmet har en makker i underklubben. Fjern makkerforholdet i BC3 først." }),
        ClubMemberRepository.MembershipChangeStatus.GroupAssigned =>
            Conflict(new { code = "group_assigned", error = "Medlemmet er tilknyttet en gruppe. Fjern gruppetilknytningen i BC3 først." }),
        _ => Conflict(new { code = "membership_changed", error = "Medlemskabet blev ændret undervejs. Opdatér siden og prøv igen." }),
    };

    [HttpPost]
    [ProducesResponseType(typeof(ClubMemberResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(
        int fdbNo, int clubId, [FromBody] CreateClubMemberDto input, CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0) return NotFound();
        if (string.IsNullOrWhiteSpace(input.Name))
            return BadRequest(new { error = "Name is required." });

        var result = await repository.CreateAsync(clubId, input, cancellationToken);
        if (result.ClubMissing) return NotFound();
        if (result.Duplicate) return Conflict(new { error = "MemberNo is already in use." });
        if (result.Member is null) return Problem(statusCode: 500, detail: "Member creation failed.");
        return CreatedAtAction(nameof(Get), new { fdbNo, clubId, memberId = result.Member.MemberId }, result.Member);
    }

    [HttpPut("{memberId:int}")]
    [ProducesResponseType(typeof(ClubMemberResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        int fdbNo, int clubId, int memberId, [FromBody] UpdateClubMemberDto input,
        CancellationToken cancellationToken)
    {
        if (fdbNo != 9999 || clubId <= 0 || memberId <= 0) return NotFound();
        if (input.Name is not null && string.IsNullOrWhiteSpace(input.Name))
            return BadRequest(new { error = "Name cannot be blank." });
        if (input.Name is null && input.Address1 is null && input.Address2 is null &&
            input.CountryCode is null && input.ZipCode is null && input.City is null &&
            input.Phone1 is null && input.Phone2 is null && input.Phone3 is null &&
            input.Email is null && input.ClubStart is null)
            return BadRequest(new { error = "Provide at least one editable field." });

        var member = await repository.UpdateAsync(clubId, memberId, input, cancellationToken);
        return member is null ? NotFound() : Ok(member);
    }

}
