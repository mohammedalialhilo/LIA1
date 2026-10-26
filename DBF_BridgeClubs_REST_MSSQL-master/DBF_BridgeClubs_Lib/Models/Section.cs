using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class Section
	{
		#region Properties
		public int SectionID { get; set; }
		public int GroupTournamentID { get; set; }
		public int MainTournamentID { get; set; }
		public int? SectionNo { get; set; }
		public DateTime? StartTime { get; set; }
		public DateTime? EndTime { get; set; }
		public int? StartRoundNo { get; set; }
		public int? EndRoundNo { get; set; }
		public int? WaveStartIndex { get; set; }
		public int? WaveLength { get; set; }
		public int? WaveEqWaveIndex { get; set; }
		public int? PaymentStatus { get; set; }
		public int? SectionScoreValid { get; set; }
		public int? TotalScoreValid { get; set; }

		#endregion

		#region Constructor
		public Section()
		{

		}

		public Section(int sectionId, int groupTournamentId, int mainTournamentId, int? sectionNo, DateTime? startTime, DateTime? endTime, int? startRoundNo, int? endRoundNo, int? waveStartIndex, int? waveLength, int? waveEqWaveIndex, int? paymentStatus, int? sectionScoreValid, int? totalScoreValid)
		{
			SectionID = sectionId;
			GroupTournamentID = groupTournamentId;
			MainTournamentID = mainTournamentId;
			SectionNo = sectionNo;
			StartTime = startTime;
			EndTime = endTime;
			StartRoundNo = startRoundNo;
			EndRoundNo = endRoundNo;
			WaveStartIndex = waveEqWaveIndex;
			WaveLength = waveLength;
			WaveEqWaveIndex = waveEqWaveIndex;
			PaymentStatus = paymentStatus;
			SectionScoreValid = sectionScoreValid;
			TotalScoreValid = totalScoreValid;
		}
		#endregion
	}
}
