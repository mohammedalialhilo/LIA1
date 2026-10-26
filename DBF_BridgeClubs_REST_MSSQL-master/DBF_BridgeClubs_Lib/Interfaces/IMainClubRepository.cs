using DBF_BridgeClubs_Lib.Models;

namespace DBF_BridgeClubs_Lib.Interfaces
{
	public interface IMainClubRepository
	{
		Task<MainClub> GetMainClubAsync();
	}
}