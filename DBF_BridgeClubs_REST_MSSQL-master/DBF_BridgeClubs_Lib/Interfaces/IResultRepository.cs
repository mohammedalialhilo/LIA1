using DBF_BridgeClubs_Lib.Models;

namespace DBF_BridgeClubs_Lib.Interfaces
{
	public interface IResultRepository
	{
		Task<IEnumerable<Result>> GetResultsAsync(int sectionId);
	}
}