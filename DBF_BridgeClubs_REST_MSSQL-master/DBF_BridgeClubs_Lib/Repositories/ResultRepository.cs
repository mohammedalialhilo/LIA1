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
	public class ResultRepository : IResultRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectSql;

		public ResultRepository(string clubNo)
		{
			selectSql = "SELECT RE.ID AS RESULTID, S.ID AS SECTIONID, RE.BOARDNO AS BOARDNO, RE.BOARDGROUP AS BOARDGROUP, RE.BIDDINGSEQUENCE AS BIDDINGSEQUENCE, RE.CONTRACT AS CONTRACT, RE.LEAD AS LEAD, RE.RESULT AS RESULT, RE.CALCULATEDSCORENS AS CALCULATEDSCORENS, RE.CALCULATEDSCORENSPCT AS CALCULATEDSCORENSPCT, RE.CALCULATEDSCOREEW AS CALCULATEDSCOREEW, RE.CALCULATEDSCOREEWPCT AS CALCULATEDSCOREEWPCT, RE.DECLARER AS DECLARER, RE.DOUBLING AS DOUBLING, RE.TRICKS AS TRICKS, RE.RESULTCOMPLETED AS RESULTCOMPLETED, RE.EXCLUDEGAME AS EXCLUDEGAME, RE.BOARDCOMPARED AS BOARDCOMPARED FROM club" + clubNo + ".SECTION S JOIN club" + clubNo + ".ROUND R ON R.FKSECTIONID = S.ID JOIN club" + clubNo + ".ROUNDMATCH M ON R.ID = M.FKROUNDID JOIN club" + clubNo + ".RESULT RE ON RE.FKMATCHID = M.ID WHERE S.ID = @SECTIONID";
		}

		public async Task<IEnumerable<Result>> GetResultsAsync(int sectionId)
		{
			List<Result> results = new List<Result>();
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
								int resultId = reader.GetInt32("RESULTID");
								int? fksectionId = reader.IsDBNull("SECTIONID") ? null : reader.GetInt32("SECTIONID");
								int? boardNo = reader.IsDBNull("BOARDNO") ? null : reader.GetInt32("BOARDNO");
								int? boardGroup = reader.IsDBNull("BOARDGROUP") ? null : reader.GetInt32("BOARDGROUP");
								string? contract = reader.IsDBNull("CONTRACT") ? null : reader.GetString("CONTRACT");
								string? lead = reader.IsDBNull("LEAD") ? null : reader.GetString("LEAD");
								int? matchResult = reader.IsDBNull("RESULT") ? null : reader.GetInt32("RESULT");
								double? calculatedScoreNs = reader.IsDBNull("CALCULATEDSCORENS") ? null : reader.GetDouble("CALCULATEDSCORENS");
								double? calculatedScoreNspct = reader.IsDBNull("CALCULATEDSCORENSPCT") ? null : reader.GetDouble("CALCULATEDSCORENSPCT");
								double? calculatedScoreEw = reader.IsDBNull("CALCULATEDSCOREEW") ? null : reader.GetDouble("CALCULATEDSCOREEW");
								double? calculatedScoreEwpct = reader.IsDBNull("CALCULATEDSCOREEWPCT") ? null : reader.GetDouble("CALCULATEDSCOREEWPCT");
								string? declarer = reader.IsDBNull("DECLARER") ? null : reader.GetString("DECLARER");
								string? doubling = reader.IsDBNull("DOUBLING") ? null : reader.GetString("DOUBLING");
								int? tricks = reader.IsDBNull("TRICKS") ? null : reader.GetInt32("TRICKS");
								int? resultCompleted = reader.IsDBNull("RESULTCOMPLETED") ? null : reader.GetInt16("RESULTCOMPLETED");
								int? excludeGame = reader.IsDBNull("EXCLUDEGAME") ? null : reader.GetInt16("EXCLUDEGAME");
								int? boardCompared = reader.IsDBNull("BOARDCOMPARED") ? null : reader.GetInt16("BOARDCOMPARED");
								if (fksectionId != null && fksectionId == sectionId)
								{
									Result result = new Result(resultId, sectionId, boardNo, boardGroup, contract, lead, matchResult, calculatedScoreNs, calculatedScoreNspct, calculatedScoreEw, calculatedScoreEwpct, declarer, doubling, tricks, resultCompleted, excludeGame, boardCompared);
									results.Add(result);
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
			return results;
		}
	}
}
