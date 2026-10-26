using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class Round
	{
		#region Properties
		public int RoundID { get; set; }
		public int SectionID { get; set; }
		public int? RoundNo { get; set; }
		public int? HalfNo { get; set; }
		public int? TableNo { get; set; }
		public int? BoardSet { get; set; }
		public int? BoardSpec { get; set; }
		public int? NorthTeamNo { get; set; }
		public int? SouthTeamNo { get; set; }
		public int? EastTeamNo { get; set; }
		public int? WestTeamNo { get; set; }
		public double? CalculatedScoreNS { get; set; }
		public double? CalculatedTeamScoreNS { get; set; }
		public double? CalculatedScoreEW { get; set; }
		public double? CalculatedTeamScoreEW { get; set; }
		public double? CalculatedTeamVPNS { get; set; }
		public double? CalculatedTeamVPEW { get; set; }
		public int? CalculatedBoards { get; set; }

		#endregion

		#region Constructor
		public Round()
		{

		}
		public Round(int roundId, int sectionId, int? roundNo, int? halfNo, int? tableNo, int? boardSet, int? boardSpec, int? northTeamNo, int? southTeamNo, int? eastTeamNo, int? westTeamNo, double? calculatedScoreNs, double? calculatedTeamScoreNs, double? calculatedScoreEw, double? calculatedTeamScoreEw, double? calculatedTeamVpns, double? calculatedTeamVpew, int? calculatedBoards)
		{
			RoundID = roundId;
			SectionID = sectionId;
			RoundNo = roundNo;
			HalfNo = halfNo;
			TableNo = tableNo;
			BoardSet = boardSet;
			BoardSpec = boardSpec;
			NorthTeamNo = northTeamNo;
			SouthTeamNo = southTeamNo;
			EastTeamNo = eastTeamNo;
			WestTeamNo = westTeamNo;
			CalculatedScoreNS = calculatedScoreNs;
			CalculatedTeamScoreNS = calculatedTeamScoreNs;
			CalculatedScoreEW = calculatedScoreEw;
			CalculatedTeamScoreEW = calculatedTeamScoreEw;
			CalculatedTeamVPNS = calculatedTeamVpns;
			CalculatedTeamVPEW = calculatedTeamVpew;
			CalculatedBoards = calculatedBoards;
		}
		#endregion
	}
}
