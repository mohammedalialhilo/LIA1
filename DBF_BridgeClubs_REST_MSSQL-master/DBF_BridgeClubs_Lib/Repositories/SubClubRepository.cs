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
	public class SubClubRepository : ISubClubRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectSql; 

		public SubClubRepository(string clubNo)
		{
			selectSql = "SELECT CLUB_ID, ORG_CLUB_ID, CLUB_NAME, LEADER_ID, GAME_DAY, NO_SMOKING, IS_VISIBLE, REMOTE_PROFILE_ID, LAST_CHANGED_BY, GAME_TIME FROM club" + clubNo + ".MEM_CLUB";
		}

		public async Task<IEnumerable<SubClub>> GetSubClubsAsync()
		{
			List<SubClub> subClubs = new List<SubClub>();
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
								int clubId = reader.GetInt32("CLUB_ID");
								int? orgClubId = reader.IsDBNull("ORG_CLUB_ID") ? null : reader.GetInt32("ORG_CLUB_ID");
								string? clubName = reader.IsDBNull("CLUB_NAME") ? null : reader.GetString("CLUB_NAME");
								int? leaderId = reader.IsDBNull("LEADER_ID") ? null : reader.GetInt32("LEADER_ID");
								int? gameDay = reader.IsDBNull("GAME_DAY") ? null : reader.GetInt16("GAME_DAY");
								string? noSmoking = reader.IsDBNull("NO_SMOKING") ? null : reader.GetString("NO_SMOKING");
								string? isVisible = reader.IsDBNull("IS_VISIBLE") ? null : reader.GetString("IS_VISIBLE");
								string? lastChangedBy = reader.IsDBNull("LAST_CHANGED_BY") ? null : reader.GetString("LAST_CHANGED_BY");
								TimeOnly? gameTime = reader.IsDBNull(reader.GetOrdinal("GAME_TIME")) ? null : TimeOnly.FromTimeSpan(reader.GetTimeSpan(reader.GetOrdinal("GAME_TIME")));
								SubClub subClub = new SubClub(clubId, orgClubId, clubName, leaderId, gameDay, noSmoking, isVisible, lastChangedBy, gameTime);
								subClubs.Add(subClub);
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
			}
			return subClubs;
		}
	}
}
