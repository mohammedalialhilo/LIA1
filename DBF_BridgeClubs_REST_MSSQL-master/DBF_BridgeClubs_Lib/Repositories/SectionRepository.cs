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
	public class SectionRepository : ISectionRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectSql;

		public SectionRepository(string clubNo)
		{
			selectSql = "SELECT S.ID AS SECTIONID, G.ID AS GROUPTOURNAMENTID, G.FKMAINTOURNAMENTID AS MAINTOURNAMENTID, S.SECTIONNO AS SECTIONNO, S.STARTTIME AS STARTTIME, S.ENDTIME AS ENDTIME, S.STARTROUNDNO AS STARTROUNDNO, S.ENDROUNDNO AS ENDROUNDNO, S.WAVESTARTINDEX AS WAVESTARTINDEX, S.WAVELENGTH AS WAVELENGTH, S.WAVEEQWAVEINDEX AS WAVEEQWAVEINDEX, S.PAYMENTSTATUS AS PAYMENTSTATUS, S.SECTIONSCOREVALID AS SECTIONSCOREVALID, S.TOTALSCOREVALID AS TOTALSCOREVALID FROM club" + clubNo + ".GROUPTOURNAMENT G JOIN club" + clubNo + ".SECTION S ON G.ID = S.FKGROUPTOURNAMENTID WHERE G.FKMAINTOURNAMENTID = @MAINTOURNAMENTID";
		}

		public async Task<IEnumerable<Section>> GetSectionsByMaintournamentIdAsync(int maintournamentId)
		{
			List<Section> sections = new List<Section>();
			using (SqlConnection connect = new SqlConnection(connectString))
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectSql, connect))
					{
						command.Parameters.AddWithValue("@MAINTOURNAMENTID", maintournamentId);
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int sectionId = reader.GetInt32("SECTIONID");
								int groupTournamentId = reader.GetInt32("GROUPTOURNAMENTID");
								int fkmainTournamentId = reader.GetInt32("MAINTOURNAMENTID");
								int? sectionNo = reader.IsDBNull("SECTIONNO") ? null : reader.GetInt32("SECTIONNO");
								DateTime? startTime = reader.IsDBNull("STARTTIME") ? null : reader.GetDateTime("STARTTIME");
								DateTime? endTime = reader.IsDBNull("ENDTIME") ? null : reader.GetDateTime("ENDTIME");
								int? startRoundNo = reader.IsDBNull("STARTROUNDNO") ? null : reader.GetInt32("STARTROUNDNO");
								int? endRoundNo = reader.IsDBNull("ENDROUNDNO") ? null : reader.GetInt32("ENDROUNDNO");
								int? waveStartIndex = reader.IsDBNull("WAVESTARTINDEX") ? null : reader.GetInt32("WAVESTARTINDEX");
								int? waveLength = reader.IsDBNull("WAVELENGTH") ? null : reader.GetInt32("WAVELENGTH");
								int? waveEqWaveIndex = reader.IsDBNull("WAVEEQWAVEINDEX") ? null : reader.GetInt32("WAVEEQWAVEINDEX");
								int? paymentStatus = reader.IsDBNull("PAYMENTSTATUS") ? null : reader.GetInt32("PAYMENTSTATUS");
								int? sectionScoreValid = reader.IsDBNull("SECTIONSCOREVALID") ? null : reader.GetInt16("SECTIONSCOREVALID");
								int? totalScoreValid = reader.IsDBNull("TOTALSCOREVALID") ? null : reader.GetInt16("TOTALSCOREVALID");
								if (maintournamentId == fkmainTournamentId)
								{
									Section section = new Section(sectionId, groupTournamentId, fkmainTournamentId, sectionNo, startTime, endTime, startRoundNo, endRoundNo, waveStartIndex, waveLength, waveEqWaveIndex, paymentStatus, sectionScoreValid, totalScoreValid);
									sections.Add(section);
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
			return sections;
		}
	}
}
