namespace DBF_BridgeClubs_Lib.Models
{
	public class MainClub
	{
		#region Properties
		public int MainClubID { get; set; }
		public int? OrgMainClubID { get; set; }
		public int? OrgClubNo { get; set; }
		public string? Location { get; set; }
		public string? Name { get; set; }
		public string? Address1 { get; set; }
		public string? Address2 { get; set; }
		public string? ZipCode { get; set; }
		public string? City { get; set; }
		public string? Phone1 { get; set; }
		public string? Phone2 { get; set; }
		public string? Email { get; set; }
		public string? HomePage { get; set; }
		public string? SeasonStart { get; set; }

		#endregion

		#region Constructors
		public MainClub()
		{

		}

		public MainClub(int mainClubId, int? orgMainClubId, int? orgClubNo, string? location, string? name, string? address1, string? address2, string? zipCode, string? city, string? phone1, string? phone2, string? email, string? homePage, string? seasonStart)
		{
			MainClubID = mainClubId;
			OrgMainClubID = orgMainClubId;
			OrgClubNo = orgClubNo;
			Location = location;
			Name = name;
			Address1 = address1;
			Address2 = address2;
			ZipCode = zipCode;
			City = city;
			Phone1 = phone1;
			Phone2 = phone2;
			Email = email;
			HomePage = homePage;
			SeasonStart = seasonStart;
		}
		#endregion
	}
}
