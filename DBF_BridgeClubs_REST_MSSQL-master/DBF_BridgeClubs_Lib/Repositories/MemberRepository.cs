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
	public class MemberRepository : IMemberRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectSql;
		private readonly string selectByMemNoSql; 

		public MemberRepository(string clubNo)
		{
			selectSql = "SELECT MEMBER_ID, MEMBER_NO, NAME, ADDRESS_1, ADDRESS_2, COUNTRY_CODE, ZIP_CODE, CITY, PHONE_1, PHONE_2, PHONE_3, EMAIL, CLUB_START, TOTAL_BRONZE, TOTAL_SILVER, TOTAL_GOLD, TOTAL_MASTER FROM club" + clubNo + ".MEM_MEMBER";
			selectByMemNoSql = "SELECT MEMBER_ID, MEMBER_NO, NAME, ADDRESS_1, ADDRESS_2, COUNTRY_CODE, ZIP_CODE, CITY, PHONE_1, PHONE_2, PHONE_3, EMAIL, CLUB_START, TOTAL_BRONZE, TOTAL_SILVER, TOTAL_GOLD, TOTAL_MASTER FROM club" + clubNo + ".MEM_MEMBER WHERE MEMBER_NO = @MEMBER_NO";
		}

		public async Task<IEnumerable<Member>> GetMembersAsync()
		{
			List<Member> members = new List<Member>();
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
								int memberId = reader.GetInt32("MEMBER_ID");
								int? memberNo = reader.IsDBNull("MEMBER_NO") ? null : reader.GetInt32("MEMBER_NO");
								string? name = reader.IsDBNull("NAME") ? null : reader.GetString("NAME");
								string? address1 = reader.IsDBNull("ADDRESS_1") ? null : reader.GetString("ADDRESS_1");
								string? address2 = reader.IsDBNull("ADDRESS_2") ? null : reader.GetString("ADDRESS_2");
								string? countryCode = reader.IsDBNull("COUNTRY_CODE") ? null : reader.GetString("COUNTRY_CODE");
								string? zipCode = reader.IsDBNull("ZIP_CODE") ? null : reader.GetString("ZIP_CODE");
								string? city = reader.IsDBNull("CITY") ? null : reader.GetString("CITY");
								string? phone1 = reader.IsDBNull("PHONE_1") ? null : reader.GetString("PHONE_1");
								string? phone2 = reader.IsDBNull("PHONE_2") ? null : reader.GetString("PHONE_2");
								string? phone3 = reader.IsDBNull("PHONE_3") ? null : reader.GetString("PHONE_3");
								string? email = reader.IsDBNull("EMAIL") ? null : reader.GetString("EMAIL");
								DateOnly? clubStart = reader.IsDBNull(reader.GetOrdinal("CLUB_START")) ? null : DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("CLUB_START")));
								double? totalBronze = reader.IsDBNull("TOTAL_BRONZE") ? null : reader.GetDouble("TOTAL_BRONZE");
								double? totalSilver = reader.IsDBNull("TOTAL_SILVER") ? null : reader.GetDouble("TOTAL_SILVER");
								double? totalGold = reader.IsDBNull("TOTAL_GOLD") ? null : reader.GetDouble("TOTAL_GOLD");
								double? totalMaster = reader.IsDBNull("TOTAL_MASTER") ? null : reader.GetDouble("TOTAL_MASTER");
								Member member = new Member(memberId, memberNo, name, address1, address2, countryCode, zipCode, city, phone1, phone2, phone3, email, clubStart, totalBronze, totalSilver, totalGold, totalMaster);
								members.Add(member);
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
			}
			return members;
		}

		public async Task<Member> GetMemberByMemberNoAsync(int memberNo)
		{
			Member member = new Member();
			using (SqlConnection connect = new SqlConnection())
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectByMemNoSql, connect))
					{
						command.Parameters.AddWithValue("@MEMBER_NO", memberNo);
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int memberId = reader.GetInt32("MEMBER_ID");
								string? name = reader.GetString("NAME");
								string? address1 = reader.GetString("ADDRESS_1");
								string? address2 = reader.GetString("ADDRESS_2");
								string? countryCode = reader.GetString("COUNTRY_CODE");
								string? zipCode = reader.GetString("ZIP_CODE");
								string? city = reader.GetString("CITY");
								string? phone1 = reader.GetString("PHONE_1");
								string? phone2 = reader.GetString("PHONE_2");
								string? phone3 = reader.GetString("PHONE_3");
								string? email = reader.GetString("EMAIL");
								DateOnly? clubStart = reader.IsDBNull(reader.GetOrdinal("CLUB_START")) ? null : DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("CLUB_START")));
								double? totalBronze = reader.GetDouble("TOTAL_BRONZE");
								double? totalSilver = reader.GetDouble("TOTAL_SILVER");
								double? totalGold = reader.GetDouble("TOTAL_GOLD");
								double? totalMaster = reader.GetDouble("TOTAL_MASTER");
								member = new Member(memberId, memberNo, name, address1, address2, countryCode, zipCode, city, phone1, phone2, phone3, email, clubStart, totalBronze, totalSilver, totalGold, totalMaster);
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
			}
			return member;
		}
	}
}
