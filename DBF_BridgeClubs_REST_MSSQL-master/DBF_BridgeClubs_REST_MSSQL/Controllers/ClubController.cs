using DBF_BridgeClubs_Lib.Interfaces;
using DBF_BridgeClubs_Lib.Models;
using DBF_BridgeClubs_Lib.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers
{
	public class ClubController : Controller
	{
		IMainClubRepository mainClubRepo;
		ISubClubRepository subClubRepo;
		IMemberRepository memberRepo;
		IMemberClubRepository memberClubRepo;
		ITournamentRepository tournamentRepo;

		[HttpGet("{clubNo}/MainClub")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<MainClub>> GetClub(string clubNo)
		{
			mainClubRepo = new MainClubRepository(clubNo);
			MainClub result = await mainClubRepo.GetMainClubAsync();
			if (result == null)
			{
				return NotFound();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/SubClubs")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<SubClub>>> GetSubClub(string clubNo)
		{
			subClubRepo = new SubClubRepository(clubNo);
			IEnumerable<SubClub> result = await subClubRepo.GetSubClubsAsync();
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/Members")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<Member>>> GetMembers(string clubNo)
		{
			memberRepo = new MemberRepository(clubNo);
			IEnumerable<Member> result = await memberRepo.GetMembersAsync();
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{fdbNo}/Members/{memberNo}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<ActionResult<Member>> GetMembersByNo(string clubNo, int memberNo)
		{
			memberRepo = new MemberRepository(clubNo);
			Member result = await memberRepo.GetMemberByMemberNoAsync(memberNo);
			if (result == null)
			{
				return NotFound();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/MemberClubs")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<MemberClub>> GetMemberClubs(string clubNo)
		{
			memberClubRepo = new MemberClubRepository(clubNo);
			IEnumerable<MemberClub> result = await memberClubRepo.GetMemberClubsAsync();
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/{clubId}/Tournaments")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<MainTournament>>> GetTournaments(string clubNo, int clubId)
		{
			tournamentRepo = new TournamentRepository(clubNo);
			IEnumerable<MainTournament> result = await tournamentRepo.GetMainTournamentsByClubIdAsync(clubId);
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}
	}
}
