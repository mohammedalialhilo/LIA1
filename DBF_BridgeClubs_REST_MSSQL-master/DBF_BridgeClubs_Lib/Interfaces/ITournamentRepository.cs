using DBF_BridgeClubs_Lib.Models;

namespace DBF_BridgeClubs_Lib.Interfaces
{
	public interface ITournamentRepository
	{
		Task<IEnumerable<MainTournament>> GetMainTournamentsByClubIdAsync(int clubId);
		Task<IEnumerable<GroupTournament>> GetGroupTournamentsByMaintournamentIdAsync(int mainTournamentId);
	}
}