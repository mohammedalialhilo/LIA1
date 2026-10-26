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
	public class RoundRepository : IRoundRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectSql;

		public RoundRepository(string clubNo)
		{
			selectSql = "SELECT R.ID AS ROUNDID, S.ID AS SECTIONID, R.ROUNDNO AS ROUNDNO, R.HALFNO AS HALFNO, M.TABLENO AS TABLENO, M.BOARDSET AS BOARDSET, M.BOARDSPEC AS BOARDSPEC, M.NORTHTEAMNO AS NORTHTEAMNO, M.SOUTHTEAMNO AS SOUTHTEAMNO, M.EASTTEAMNO AS EASTTEAMNO, M.WESTTEAMNO AS WESTTEAMNO, M.CALCULATEDSCORENS AS CALCULATEDSCORENS, M.CALCULATEDTEAMSCORENS AS CALCULATEDTEAMSCORENS, M.CALCULATEDSCOREEW AS CALCULATEDSCOREEW, M.CALCULATEDTEAMSCOREEW AS CALCULATEDTEAMSCOREEW, M.CALCULATEDTEAMVPNS AS CALCULATEDTEAMVPNS, M.CALCULATEDTEAMVPEW AS CALCULATEDTEAMVPEW, M.CALCULATEDBOARDS AS CALCULATEDBOARDS FROM club" + clubNo + ".SECTION S JOIN club" + clubNo + ".ROUND R ON R.FKSECTIONID = S.ID JOIN club" + clubNo + ".ROUNDMATCH M ON M.FKROUNDID = R.ID WHERE S.ID = @SECTIONID";
		}

		public async Task<List<Round>> GetRoundsAsync(int sectionId)
		{
			List<Round> rounds = new List<Round>();
			using (SqlConnection connect = new SqlConnection(connectString))
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectSql, connect))
					{
						command.Parameters.AddWithValue("@SECTIONID", sectionId);
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int roundId = reader.GetInt32("ROUNDID");
								int fksectionId = reader.GetInt32("SECTIONID");
								int? roundNo = reader.IsDBNull("ROUNDNO") ? null : reader.GetInt32("ROUNDNO");
								int? halfNo = reader.IsDBNull("HALFNO") ? null : reader.GetInt32("HALFNO");
								int? tableNo = reader.IsDBNull("TABLENO") ? null : reader.GetInt32("TABLENO");
								int? boardSet = reader.IsDBNull("BOARDSET") ? null : reader.GetInt32("BOARDSET");
								int? boardSpec = reader.IsDBNull("BOARDSPEC") ? null : reader.GetInt32("BOARDSPEC");
								int? northTeamNo = reader.IsDBNull("NORTHTEAMNO") ? null : reader.GetInt32("NORTHTEAMNO");
								int? southTeamNo = reader.IsDBNull("SOUTHTEAMNO") ? null : reader.GetInt32("SOUTHTEAMNO");
								int? eastTeamNo = reader.IsDBNull("EASTTEAMNO") ? null : reader.GetInt32("EASTTEAMNO");
								int? westTeamNo = reader.IsDBNull("WESTTEAMNO") ? null : reader.GetInt32("WESTTEAMNO");
								double? calculatedScoreNs = reader.IsDBNull("CALCULATEDSCORENS") ? null : reader.GetDouble("CALCULATEDSCORENS");
								double? calculatedTeamScoreNs = reader.IsDBNull("CALCULATEDTEAMSCORENS") ? null : reader.GetDouble("CALCULATEDTEAMSCORENS");
								double? calculatedScoreEw = reader.IsDBNull("CALCULATEDSCOREEW") ? null : reader.GetDouble("CALCULATEDSCOREEW");
								double? calculatedTeamScoreEw = reader.IsDBNull("CALCULATEDTEAMSCOREEW") ? null : reader.GetDouble("CALCULATEDTEAMSCOREEW");
								double? calculatedTeamVpns = reader.IsDBNull("CALCULATEDTEAMVPNS") ? null : reader.GetDouble("CALCULATEDTEAMVPNS");
								double? calculatedTeamVpew = reader.IsDBNull("CALCULATEDTEAMVPEW") ? null : reader.GetDouble("CALCULATEDTEAMVPEW");
								int? calculatedBoards = reader.IsDBNull("CALCULATEDBOARDS") ? null : reader.GetInt32("CALCULATEDBOARDS");
								if (fksectionId == sectionId)
								{
									Round round = new Round(roundId, sectionId, roundNo, halfNo, tableNo, boardSet, boardSpec, northTeamNo, southTeamNo, eastTeamNo, westTeamNo, calculatedScoreNs, calculatedTeamScoreNs, calculatedScoreEw, calculatedTeamScoreEw, calculatedTeamVpns, calculatedTeamVpew, calculatedBoards);
									rounds.Add(round);
								}
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
			}
			return rounds;
		}
	}
}
