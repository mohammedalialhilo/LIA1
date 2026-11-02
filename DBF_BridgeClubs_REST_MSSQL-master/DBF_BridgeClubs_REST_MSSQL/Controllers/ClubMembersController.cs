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
