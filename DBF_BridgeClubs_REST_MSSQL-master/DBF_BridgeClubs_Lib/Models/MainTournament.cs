using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class MainTournament
	{
		#region Properties
		public int MainTournamentID { get; set; }
		public string? Name { get; set; }
		public string? Description { get; set; }
		public int? TournamentForm { get; set; }
		public int? CommonTop { get; set; }
		public int? ClubID { get; set; }
		public int? IncludeClubName { get; set; }
		public int? UseLeads { get; set; }
		public int? NumberOfPlayingDays { get; set; }
		#endregion

		#region Constructor
		public MainTournament()
		{

		}
		public MainTournament(int mainTournamentId, string? name, string? description, int? tournamentForm, int? commonTop, int? clubId, int? includeClubName, int? useLeads, int? numberOfPlayingDays)
		{
			MainTournamentID = mainTournamentId;
			Name = name;
			Description = description;
			TournamentForm = tournamentForm;
			CommonTop = commonTop;
			ClubID = clubId;
			IncludeClubName = includeClubName;
			UseLeads = useLeads;
			NumberOfPlayingDays = numberOfPlayingDays;
		}
		#endregion
	}
}
