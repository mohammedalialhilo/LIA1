using BridgeTourneringLib;
using DBF_BridgeClubs_Lib.Interfaces;
using DBF_BridgeClubs_Lib.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBF_BridgeClubs_Lib.Repositories
{
	public class MainClubRepository : IMainClubRepository
	{
		private string connectString = Secret.ConnectionString;
		private string selectSql; 

		public MainClubRepository(string clubNo)
		{
			selectSql = "SELECT MAINCLUB_ID, ORG_MAINCLUB_ID, ORG_CLUB_NO, LOCATION, NAME, ADDRESS_1, ADDRESS_2, ZIP_CODE, CITY, PHONE_1, PHONE_2, EMAIL, HOMEPAGE, SEASON_START FROM club" + clubNo + ".SYS_MAINCLUB";
		}

		public async Task<MainClub> GetMainClubAsync()
		{
			MainClub mainClub = new MainClub();
			using (SqlConnection connect = new SqlConnection(connectString))
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectSql, connect))
					{
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int mainClubId = reader.GetInt32("MAINCLUB_ID");
								int? orgMainClubId = reader.IsDBNull("ORG_MAINCLUB_ID") ? null : reader.GetInt32("ORG_MAINCLUB_ID");
								int? orgClubNo = reader.IsDBNull("ORG_CLUB_NO") ? null : reader.GetInt32("ORG_CLUB_NO");
								string? location = reader.IsDBNull("LOCATION") ? null : reader.GetString("LOCATION");
								string? name = reader.IsDBNull("NAME") ? null : reader.GetString("NAME");
								string? address1 = reader.IsDBNull("ADDRESS_1") ? null : reader.GetString("ADDRESS_1");
								string? address2 = reader.IsDBNull("ADDRESS_2") ? "" : reader.GetString("ADDRESS_2");
								string? zipCode = reader.IsDBNull("ZIP_CODE") ? null : reader.GetString("ZIP_CODE");
								string? city = reader.IsDBNull("CITY") ? null : reader.GetString("CITY");
								string? phone1 = reader.IsDBNull("PHONE_1") ? null : reader.GetString("PHONE_1");
								string? phone2 = reader.IsDBNull("PHONE_2") ? null : reader.GetString("PHONE_2");
								string? email = reader.IsDBNull("EMAIL") ? null : reader.GetString("EMAIL");
								string? homePage = reader.IsDBNull("HOMEPAGE") ? null : reader.GetString("HOMEPAGE");
								string? seasonStart = reader.IsDBNull("SEASON_START") ? null : reader.GetString("SEASON_START");
								mainClub = new MainClub(mainClubId, orgMainClubId, orgClubNo, location, name, address1, address2, zipCode, city, phone1, phone2, email, homePage, seasonStart);
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
				return mainClub;
			}
		}
	}
}
