using DBF_BridgeClubs_Lib.Repositories;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers;

/// <summary>
/// Read endpoints used by bridge-danmark-platform-main's Online BC3 screens.
/// </summary>
[ApiController]
[Route("api/Clubs")]
public class PlatformClubsController : ControllerBase
{
    [HttpGet("{fdbNo:int}")]
    public async Task<IActionResult> GetClub(int fdbNo)
    {
        var club = fdbNo == 9999
            ? await new FirebirdPlatformRepository().GetMainClubAsync()
            : await new MainClubRepository(fdbNo.ToString()).GetMainClubAsync();
        if (club.MainClubID == 0)
        {
            return NotFound();
        }

        return Ok(new
        {
            clubNo = club.OrgClubNo ?? fdbNo,
            name = club.Name ?? string.Empty,
            status = string.Empty,
            address = club.Address1 ?? string.Empty,
            postalCode = club.ZipCode ?? string.Empty,
            city = club.City ?? string.Empty,
            phone = club.Phone1 ?? string.Empty,
            email = club.Email ?? string.Empty,
            website = club.HomePage ?? string.Empty,
            districtNo = (int?)null,
        });
    }

    [HttpGet("{fdbNo:int}/SubClubs")]
    public async Task<IActionResult> GetSubClubs(int fdbNo)
    {
        var clubs = fdbNo == 9999
            ? await new FirebirdPlatformRepository().GetSubClubsAsync()
            : await new SubClubRepository(fdbNo.ToString()).GetSubClubsAsync();
        return Ok(clubs.Select(club => new
        {
            clubID = club.ClubID,
            orgClubID = club.OrgCludID,
            clubName = club.ClubName ?? string.Empty,
            gameDay = club.GameDay,
            leaderID = club.LeaderID,
            noSmoking = club.NoSmoking,
            isVisible = club.IsVisible,
            remoteProfileID = (int?)null,
            lastChangedBy = club.LastChangedBy,
            gameTime = club.GameTime?.ToString("HH:mm") ?? string.Empty,
        }));
    }

    [HttpGet("{fdbNo:int}/Members")]
    public async Task<IActionResult> GetMembers(int fdbNo)
    {
        var members = fdbNo == 9999
            ? await new FirebirdPlatformRepository().GetMembersAsync()
            : await new MemberRepository(fdbNo.ToString()).GetMembersAsync();
        return Ok(members.Select(member => new
        {
            memberID = member.MemberID,
            memberNo = member.MemberNo,
            name = member.Name ?? string.Empty,
            address1 = member.Address1,
            address2 = member.Address2,
            countryCode = member.CountryCode,
            zipCode = member.ZipCode,
            city = member.City,
            phone1 = member.Phone1,
            phone2 = member.Phone2,
            phone3 = member.Phone3,
            email = member.Email,
            clubStart = member.ClubStart,
            totalBronze = member.TotalBronze,
            totalSilver = member.TotalSilver,
            totalGold = member.TotalGold,
            totalMaster = member.TotalMaster,
        }));
    }

    [HttpGet("{fdbNo:int}/MemberClubs")]
    public async Task<IActionResult> GetMemberClubs(int fdbNo)
    {
        var memberClubs = fdbNo == 9999
            ? await new FirebirdPlatformRepository().GetMemberClubsAsync()
            : await new MemberClubRepository(fdbNo.ToString()).GetMemberClubsAsync();
        return Ok(memberClubs);
    }
}
