using DBF_BridgeClubs_REST_MSSQL.Models;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers;

[ApiController]
[EnableCors("allowAnything")]
[Route("api/Clubs/{fdbNo:int}/Members")]
public sealed class MemberSearchController(MemberSearchRepository repository) : ControllerBase
{
    [HttpGet("Search")]
    public async Task<IActionResult> Search(int fdbNo, [FromQuery] MemberSearchQuery filters,
        CancellationToken token)
    {
        if (fdbNo != 9999) return NotFound();
        return Ok(await repository.SearchAsync(filters, token));
    }

    [HttpGet("Export")]
    public async Task<IActionResult> Export(int fdbNo, [FromQuery] MemberSearchQuery filters,
        CancellationToken token)
    {
        if (fdbNo != 9999) return NotFound();
        var (csv, total) = await repository.ExportAsync(filters, token);
        if (csv is null)
            return StatusCode(StatusCodes.Status413PayloadTooLarge,
                new { code = "too_many_members", error = $"Søgningen gav {total} medlemmer. Indsnævr filtrene før eksport." });
        return File(csv, "text/csv; charset=utf-8", "bc3-medlemmer-9999.csv");
    }
}
