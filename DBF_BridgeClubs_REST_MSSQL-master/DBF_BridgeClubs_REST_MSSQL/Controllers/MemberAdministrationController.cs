using DBF_BridgeClubs_REST_MSSQL.Models;
using DBF_BridgeClubs_REST_MSSQL.Repositories;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace DBF_BridgeClubs_REST_MSSQL.Controllers;

[ApiController]
[EnableCors("allowAnything")]
[Route("api/Clubs/{fdbNo:int}/Members")]
public sealed class MemberAdministrationController(MemberAdministrationRepository repository) : ControllerBase
{
    [HttpGet("FeeCategories")]
    public IActionResult FeeCategories(int fdbNo) =>
        fdbNo == 9999 ? Ok(MemberAdministrationRepository.FeeCategories) : NotFound();

    [HttpGet("{memberId:int}/Administration")]
    public async Task<IActionResult> Get(int fdbNo, int memberId, CancellationToken token)
    {
        if (fdbNo != 9999 || memberId <= 0) return NotFound();
        var member = await repository.GetAsync(memberId, token);
        return member is null ? NotFound() : Ok(member);
    }

    [HttpPut("{memberId:int}/FeeCategory")]
    public async Task<IActionResult> SetFeeCategory(int fdbNo, int memberId,
        [FromBody] SetFeeCategoryDto input, CancellationToken token)
    {
        if (fdbNo != 9999 || memberId <= 0) return NotFound();
        var result = await repository.SetFeeCategoryAsync(memberId, input.Code, input.ExpectedCode, token);
        return result.Status switch
        {
            MemberAdministrationRepository.CategoryStatus.Updated => Ok(result.Member),
            MemberAdministrationRepository.CategoryStatus.MemberMissing =>
                NotFound(new { code = "member_not_found", error = "Medlemmet blev ikke fundet." }),
            MemberAdministrationRepository.CategoryStatus.UnsupportedCurrent =>
                Conflict(new { code = "unsupported_category", error = "Den nuværende kontingentkategori kræver kontrol i BC3." }),
            _ => Conflict(new { code = "concurrent_change", error = "Kategorien blev ændret undervejs. Opdatér og prøv igen." }),
        };
    }

    [HttpGet("{memberId:int}/History")]
    public async Task<IActionResult> History(int fdbNo, int memberId, CancellationToken token)
    {
        if (fdbNo != 9999 || memberId <= 0) return NotFound();
        if (await repository.GetAsync(memberId, token) is null) return NotFound();
        return Ok(await repository.HistoryAsync(memberId, token));
    }
}
