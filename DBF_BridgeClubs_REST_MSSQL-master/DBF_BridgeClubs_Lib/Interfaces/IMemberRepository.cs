using DBF_BridgeClubs_Lib.Models;

namespace DBF_BridgeClubs_Lib.Interfaces
{
	public interface IMemberRepository
	{
		Task<Member> GetMemberByMemberNoAsync(int memberNo);
		Task<IEnumerable<Member>> GetMembersAsync();
	}
}