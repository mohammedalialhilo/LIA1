using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class SubClub
	{
		#region Properties
		public int ClubID { get; set; }
		public int? OrgCludID { get; set; }
		public string? ClubName { get; set; }
		public int? GameDay { get; set; }
		public int? LeaderID { get; set; }
		public string? NoSmoking { get; set; }
		public string? IsVisible { get; set; }
		public string? LastChangedBy { get; set; }
		public TimeOnly? GameTime { get; set; }
		#endregion

		#region Constructors
		public SubClub()
		{
			
		}

		public SubClub(int clubId, int? orgClubId, string? clubName, int? gameDay, int? leaderId, string? noSmoking, string? isVisible, string? lastChangedBy, TimeOnly? gameTime)
		{
			ClubID = clubId;
			OrgCludID = orgClubId;
			ClubName = clubName;
			GameDay = gameDay;
			LeaderID = leaderId;
			NoSmoking = noSmoking;
			IsVisible = isVisible;
			LastChangedBy = lastChangedBy;
			GameTime = gameTime;
		}
		#endregion
	}
}
