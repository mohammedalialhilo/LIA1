using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Models
{
	public class Member
	{
		#region Properties
		public int MemberID { get; set; }
		public int? MemberNo { get; set; }
		public string? Name { get; set; }
		public string? Address1 { get; set; }
		public string? Address2 { get; set; }
		public string? CountryCode { get; set; }
		public string? ZipCode { get; set; }
		public string? City { get; set; }
		public string? Phone1 { get; set; }
		public string? Phone2 { get; set; }
		public string? Phone3 { get; set; }
		public string? Email { get; set; }
		public DateOnly? ClubStart { get; set; }
		public double? TotalBronze { get; set; }
		public double? TotalSilver { get; set; }
		public double? TotalGold { get; set; }
		public double? TotalMaster { get; set; }

		#endregion

		#region Constructors
		public Member()
		{

		}
		public Member(int memberId, int? memberNo, string? name, string? address1, string? address2, string? countryCode, string? zipCode, string? city, string? phone1, string? phone2, string? phone3, string? email, DateOnly? clubStart, double? totalBronze, double? totalSilver, double? totalGold, double? totalMaster)
		{
			MemberID = memberId;
			MemberNo = memberNo;
			Name = name;
			Address1 = address1;
			Address2 = address2;
			CountryCode = countryCode;
			ZipCode = zipCode;
			City = city;
			Phone1 = phone1;
			Phone2 = phone2;
			Phone3 = phone3;
			Email = email;
			ClubStart = clubStart;
			TotalBronze = totalBronze;
			TotalSilver = totalSilver;
			TotalGold = totalGold;
			TotalMaster = totalMaster;
		}
		#endregion
	}
}
