using DBF_BridgeClubs_Lib.Models;

namespace DBF_BridgeClubs_Lib.Interfaces
{
	public interface IMemberClubRepository
	{
		Task<IEnumerable<MemberClub>> GetMemberClubsAsync();
	}
}