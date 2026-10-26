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
	public class TournamentRepository : ITournamentRepository
	{
		private string connectString = Secret.ConnectionString;
		private readonly string selectByClubIdSql;
		private readonly string selectByMainTournamentIdSql;

		public TournamentRepository(string clubNo)
		{
			selectByClubIdSql = "SELECT ID AS MAINTOURNAMENTID, NAME, DESCRIPTION, TOURNAMENTFORM, COMMONTOP, FKCLUBID, INCLUDECLUBNAME, USELEADS, STRENGTHGROUPCOUNT, NUMBEROFPLAYINGDAYS FROM club" + clubNo + ".MAINTOURNAMENT WHERE FKCLUBID = @CLUBID";
			selectByMainTournamentIdSql = "SELECT M.ID AS MAINTOURNAMENTID, G.ID AS GROUPTOURNAMENTID, M.NAME AS NAME, M.TOURNAMENTFORM AS TOURNAMENTFORM, M.STRENGTHGROUPCOUNT AS STRENGTHGROUPCOUNT, M.NUMBEROFGROUPS AS NUMBEROFGROUPS, M.NUMBEROFPLAYINGDAYS AS NUMBEROFPLAYINGDAYS, G.GROUPNO AS GROUPNO, G.TOURNAMENTTYPE AS TOURNAMENTTYPE, G.NUMBEROFTEAMS AS NUMBEROFTEAMS, G.NUMBEROFSECTIONS AS NUMBEROFSECTIONS, G.NUMBEROFROUNDS AS NUMBEROFROUNDS, G.NUMBEROFTABLES AS NUMBEROFTABLES, G.BOARDSPERROUND AS BOARDSPERROUND, G.HALVESPERMATCH AS HALVESPERMATCH FROM club" + clubNo + ".MAINTOURNAMENT M JOIN club" + clubNo + ".GROUPTOURNAMENT G ON G.FKMAINTOURNAMENTID = M.ID WHERE M.ID = @MAINTOURNAMENTID";
		}

		public async Task<IEnumerable<MainTournament>> GetMainTournamentsByClubIdAsync(int clubId)
		{
			List<MainTournament> mainTournaments = new List<MainTournament>();
			using (SqlConnection connect = new SqlConnection(connectString))
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectByClubIdSql, connect))
					{
						command.Parameters.AddWithValue("@CLUBID", clubId);
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int mainTournamentId = reader.GetInt32("MAINTOURNAMENTID");
								string? name = reader.IsDBNull("NAME") ? null : reader.GetString("NAME");
								string? description = reader.IsDBNull("DESCRIPTION") ? null : reader.GetString("DESCRIPTION");
								int? tournamentForm = reader.IsDBNull("TOURNAMENTFORM") ? null : reader.GetInt32("TOURNAMENTFORM");
								int? commonTop = reader.IsDBNull("COMMONTOP") ? null : reader.GetInt16("COMMONTOP");
								int? fkClubId = reader.IsDBNull("FKCLUBID") ? null : reader.GetInt32("FKCLUBID");
								int? includeClubName = reader.IsDBNull("INCLUDECLUBNAME") ? null : reader.GetInt16("INCLUDECLUBNAME");
								int? useLeads = reader.IsDBNull("USELEADS") ? null : reader.GetInt16("USELEADS");
								int? numberOfPlayingDays = reader.IsDBNull("NUMBEROFPLAYINGDAYS") ? null : reader.GetInt16("NUMBEROFPLAYINGDAYS");
								if (clubId == fkClubId)
								{
									MainTournament mainTournament = new MainTournament(mainTournamentId, name, description, tournamentForm, commonTop, fkClubId, includeClubName, useLeads, numberOfPlayingDays);
									mainTournaments.Add(mainTournament);
								}
							}
						}
					}
				}
				catch (SqlException sqlEx)
				{
					Console.WriteLine("Database Error: " + sqlEx.Message);
				}
				return mainTournaments;
			}
		}

		public async Task<IEnumerable<GroupTournament>> GetGroupTournamentsByMaintournamentIdAsync(int mainTournamentId)
		{
			List<GroupTournament> groupTournaments = new List<GroupTournament>();
			using (SqlConnection connect = new SqlConnection(connectString))
			{
				try
				{
					await connect.OpenAsync();
					using (SqlCommand command = new SqlCommand(selectByMainTournamentIdSql, connect))
					{
						command.Parameters.AddWithValue("@MAINTOURNAMENTID", mainTournamentId);
						using (SqlDataReader reader = await command.ExecuteReaderAsync())
						{
							while (await reader.ReadAsync())
							{
								int fkmainTournamentId = reader.GetInt32("MAINTOURNAMENTID");
								int groupTournementId = reader.GetInt32("GROUPTOURNAMENTID");
								string? name = reader.IsDBNull("NAME") ? null : reader.GetString("NAME");
								int? tournementForm = reader.IsDBNull("TOURNAMENTFORM") ? null : reader.GetInt32("TOURNAMENTFORM");
								int? strengthCount = reader.IsDBNull("STRENGTHGROUPCOUNT") ? null : reader.GetInt32("STRENGTHGROUPCOUNT");
								int? numberOfGroups = reader.IsDBNull("NUMBEROFGROUPS") ? null : reader.GetInt16("NUMBEROFGROUPS");
								int? numberOfPlayingDays = reader.IsDBNull("NUMBEROFPLAYINGDAYS") ? null : reader.GetInt16("NUMBEROFPLAYINGDAYS");
								int? groupNo = reader.IsDBNull("GROUPNO") ? null : reader.GetInt32("GROUPNO");
								int? tournamentType = reader.IsDBNull("TOURNAMENTTYPE") ? null : reader.GetInt32("TOURNAMENTTYPE");
								int? numberOfTeams = reader.IsDBNull("NUMBEROFTEAMS") ? null : reader.GetInt32("NUMBEROFTEAMS");
								int? numberOfSections = reader.IsDBNull("NUMBEROFSECTIONS") ? null : reader.GetInt32("NUMBEROFSECTIONS");
								int? numberOfRounds = reader.IsDBNull("NUMBEROFROUNDS") ? null : reader.GetInt32("NUMBEROFROUNDS");
								int? numberOfTables = reader.IsDBNull("NUMBEROFTABLES") ? null : reader.GetInt32("NUMBEROFTABLES");
								int? boardsPerRound = reader.IsDBNull("BOARDSPERROUND") ? null : reader.GetInt32("BOARDSPERROUND");
								int? halvesPerMatch = reader.IsDBNull("HALVESPERMATCH") ? null : reader.GetInt32("HALVESPERMATCH");
								if (mainTournamentId == fkmainTournamentId)
								{
									GroupTournament tournament = new GroupTournament(fkmainTournamentId, groupTournementId, name, tournementForm, strengthCount, numberOfGroups, numberOfPlayingDays, groupNo, tournamentType, numberOfTeams, numberOfSections, numberOfRounds, numberOfTables, boardsPerRound, halvesPerMatch);
									groupTournaments.Add(tournament);
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
			return groupTournaments;
		}
	}
}
