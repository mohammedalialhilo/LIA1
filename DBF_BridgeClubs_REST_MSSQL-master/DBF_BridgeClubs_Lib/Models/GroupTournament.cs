using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class GroupTournament
	{
		#region Properties
		public int MainTournamentID { get; set; }
		public int GroupTournamentID { get; set; }
		public string? Name { get; set; }
		public int? TournamentForm { get; set; }
		public int? StrengthGroupCount { get; set; }
		public int? NumberOfGroups { get; set; }
		public int? NumberOfPlayingDays { get; set; }
		public int? GroupNo { get; set; }
		public int? TournamentType { get; set; }
		public int? NumberOfTeams { get; set; }
		public int? NumberOfSections { get; set; }
		public int? NumberOfRounds { get; set; }
		public int? NumberOfTables { get; set; }
		public int? BoardsPerRound { get; set; }
		public int? HalvesPerMatch { get; set; }
		#endregion

		#region Constructor
		public GroupTournament()
		{

		}

		public GroupTournament(int mainTournamentId, int groupTournamentId, string? name, int? tournamentForm, int? strengthGroupCount, int? numberOfGroups, int? numberOfPlayingDays, int? groupNo, int? tournamentType, int? numberOfTeams, int? numberOfSections, int? numberOfRounds, int? numberOfTables, int? boardsPerRound, int? halvesPerMatch)
		{
			MainTournamentID = mainTournamentId;
			GroupTournamentID = groupTournamentId;
			Name = name;
			TournamentForm = tournamentForm;
			StrengthGroupCount = strengthGroupCount;
			NumberOfGroups = numberOfGroups;
			NumberOfPlayingDays = numberOfPlayingDays;
			GroupNo = groupNo;
			TournamentType = tournamentType;
			NumberOfTeams = numberOfTeams;
			NumberOfSections = numberOfSections;
			NumberOfRounds = numberOfRounds;
			NumberOfTables = numberOfTables;
			BoardsPerRound = boardsPerRound;
			HalvesPerMatch = halvesPerMatch;
		}
		#endregion
	}
}
