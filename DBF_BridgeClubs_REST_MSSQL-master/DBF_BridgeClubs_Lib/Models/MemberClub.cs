using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class MemberClub
	{
		#region Properties
		public int MemberClubID { get; set; }
		public int? MemberID { get; set; }
		public int? ClubID { get; set; }
		public int? PartnerID { get; set; }
		public string? PartnerFirst { get; set; }
		public string? IsSubstitute { get; set; }
		public int? GroupIndex { get; set; }
		public string? LastChangedBy { get; set; }
		public DateTime? LastChangedDate { get; set; }
		#endregion

		#region Constructor
		public MemberClub()
		{

		}

		public MemberClub(int memberClubId, int? memberId, int? clubId, int? partnerId, string? partnerFirst, string? isSubstitute, int? groupIndex, string? lastChangedBy, DateTime? lastChangedDate)
		{
			MemberClubID = memberClubId;
			MemberID = memberId;
			ClubID = clubId;
			PartnerID = partnerId;
			PartnerFirst = partnerFirst;
			IsSubstitute = isSubstitute;
			GroupIndex = groupIndex;
			LastChangedBy = lastChangedBy;
			LastChangedDate = lastChangedDate;
		}
		#endregion
	}
}
