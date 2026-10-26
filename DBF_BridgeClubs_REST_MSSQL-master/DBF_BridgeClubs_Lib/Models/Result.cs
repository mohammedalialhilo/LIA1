using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class Result
	{
		#region
		public int ResultID { get; set; }
		public int? SectionID { get; set; }
		public int? BoardNo { get; set; }
		public int? BoardGroup { get; set; }
		public string? BiddingSequence { get; set; }
		public string? Contract { get; set; }
		public string? Lead { get; set; }
		public int? MatchResult { get; set; }
		public double? CalculatedScoreNS { get; set; }
		public double? CalculatedScoreNSPCT { get; set; }
		public double? CalculatedScoreEW { get; set; }
		public double? CalculatedScoreEWPCT { get; set; }
		public string? Declarer { get; set; }
		public string? Doubling { get; set; }
		public int? Tricks { get; set; }
		public int? ResultCompleted { get; set; }
		public int? ExcludeGame { get; set; }
		public int? BoardCompared { get; set; }
		#endregion

		#region Constructor
		public Result()
		{

		}

		public Result(int resultId, int? sectionId, int? boardNo, int? boardGroup, string? contract, string? lead, int? matchResult, double? calcScoreNS, double? calcScoreNSPCT, double? calcScoreEW, double? calcScoreEWPCT, string? declarer, string? doubling, int? tricks, int? resultCompleted, int? excludeGame, int? boardCompared)
		{
			ResultID = resultId;
			SectionID = sectionId;
			BoardNo = boardNo;
			BoardGroup = boardGroup;
			Contract = contract;
			Lead = lead;
			MatchResult = matchResult;
			CalculatedScoreNS = calcScoreNS;
			CalculatedScoreNSPCT = calcScoreNSPCT;
			CalculatedScoreEW = calcScoreEW;
			CalculatedScoreEWPCT = calcScoreEWPCT;
			Declarer = declarer;
			Doubling = doubling;
			Tricks = tricks;
			ResultCompleted = resultCompleted;
			ExcludeGame = excludeGame;
			BoardCompared = boardCompared;
		}
		#endregion
	}
}
