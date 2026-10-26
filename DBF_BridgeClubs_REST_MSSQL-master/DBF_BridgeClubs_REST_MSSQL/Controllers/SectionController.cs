using DBF_BridgeClubs_Lib.Interfaces;
using DBF_BridgeClubs_Lib.Models;
using DBF_BridgeClubs_Lib.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers
{
	[Route("api/Sections")]
	public class SectionController : Controller
	{
		ISectionPlayerRepository sectionPlayerRepo;
		IRoundRepository roundRepo;
		IResultRepository resultRepo;

		[HttpGet("{clubNo}/Sections/{sectionId}/Participants")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<SectionPlayer>>> GetParticipants(string clubNo, int sectionId)
		{
			sectionPlayerRepo = new SectionPlayerRepository(clubNo);
			IEnumerable<SectionPlayer> result = await sectionPlayerRepo.GetSectionPlayersAsync(sectionId);
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/Sections/{sectionId}/Rounds")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<Round>>> GetRounds(string clubNo, int sectionId)
		{
			roundRepo = new RoundRepository(clubNo);
			IEnumerable<Round> result = await roundRepo.GetRoundsAsync(sectionId);
			if (result.Count() == 0)
			{
				return NoContent();
			}
			else
			{
				return Ok(result);
			}
		}

		[HttpGet("{clubNo}/Sections/{sectionId}/Result")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		public async Task<ActionResult<IEnumerable<Result>>> GetResult(string clubNo, int sectionId)
		{
			resultRepo = new ResultRepository(clubNo);
			IEnumerable<Result> result = await resultRepo.GetResultsAsync(sectionId);
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
