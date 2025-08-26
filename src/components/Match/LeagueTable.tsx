import React, { useState, useEffect } from 'react'
import { footballApi } from '../../services/footballApi'
import './LeagueTable.scss'

interface Team {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
}

interface Standing {
	position: number
	team: Team
	playedGames: number
	won: number
	draw: number
	lost: number
	points: number
	goalsFor: number
	goalsAgainst: number
	goalDifference: number
}

interface LeagueTableProps {
	selectedLeagueId: number | null
}

const LeagueTable: React.FC<LeagueTableProps> = ({ selectedLeagueId }) => {
	const [standings, setStandings] = useState<Standing[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!selectedLeagueId) {
			setStandings([])
			return
		}

		const fetchStandings = async () => {
			try {
				setLoading(true)
				setError(null)
				
				const response = await footballApi.getStandings(selectedLeagueId)
				const standingsData = response.data.standings[0]?.table || []
				setStandings(standingsData)
			} catch (err) {
				console.error('Error fetching standings:', err)
				setError('Không thể tải bảng xếp hạng')
				// Fallback data cho Premier League
				if (selectedLeagueId === 2021) {
					setStandings([
						{
							position: 1,
							team: { id: 1, name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crest: 'https://crests.football-data.org/57.png' },
							playedGames: 20,
							won: 15,
							draw: 3,
							lost: 2,
							points: 48,
							goalsFor: 45,
							goalsAgainst: 18,
							goalDifference: 27
						},
						{
							position: 2,
							team: { id: 2, name: 'Manchester City', shortName: 'Man City', tla: 'MCI', crest: 'https://crests.football-data.org/65.png' },
							playedGames: 20,
							won: 14,
							draw: 4,
							lost: 2,
							points: 46,
							goalsFor: 48,
							goalsAgainst: 23,
							goalDifference: 25
						},
						{
							position: 3,
							team: { id: 3, name: 'Liverpool', shortName: 'Liverpool', tla: 'LIV', crest: 'https://crests.football-data.org/64.png' },
							playedGames: 20,
							won: 13,
							draw: 6,
							lost: 1,
							points: 45,
							goalsFor: 43,
							goalsAgainst: 18,
							goalDifference: 25
						},
						{
							position: 4,
							team: { id: 4, name: 'Aston Villa', shortName: 'Aston Villa', tla: 'AVL', crest: 'https://crests.football-data.org/58.png' },
							playedGames: 20,
							won: 13,
							draw: 4,
							lost: 3,
							points: 43,
							goalsFor: 43,
							goalsAgainst: 27,
							goalDifference: 16
						},
						{
							position: 5,
							team: { id: 5, name: 'Tottenham Hotspur', shortName: 'Tottenham', tla: 'TOT', crest: 'https://crests.football-data.org/73.png' },
							playedGames: 20,
							won: 12,
							draw: 3,
							lost: 5,
							points: 39,
							goalsFor: 42,
							goalsAgainst: 31,
							goalDifference: 11
						},
						{
							position: 6,
							team: { id: 6, name: 'West Ham United', shortName: 'West Ham', tla: 'WHU', crest: 'https://crests.football-data.org/563.png' },
							playedGames: 20,
							won: 10,
							draw: 4,
							lost: 6,
							points: 34,
							goalsFor: 33,
							goalsAgainst: 30,
							goalDifference: 3
						},
						{
							position: 18,
							team: { id: 18, name: 'Luton Town', shortName: 'Luton', tla: 'LUT', crest: 'https://crests.football-data.org/1359.png' },
							playedGames: 20,
							won: 4,
							draw: 4,
							lost: 12,
							points: 16,
							goalsFor: 24,
							goalsAgainst: 38,
							goalDifference: -14
						},
						{
							position: 19,
							team: { id: 19, name: 'Burnley', shortName: 'Burnley', tla: 'BUR', crest: 'https://crests.football-data.org/328.png' },
							playedGames: 20,
							won: 3,
							draw: 3,
							lost: 14,
							points: 12,
							goalsFor: 20,
							goalsAgainst: 47,
							goalDifference: -27
						},
						{
							position: 20,
							team: { id: 20, name: 'Sheffield United', shortName: 'Sheffield Utd', tla: 'SHU', crest: 'https://crests.football-data.org/356.png' },
							playedGames: 20,
							won: 2,
							draw: 3,
							lost: 15,
							points: 9,
							goalsFor: 15,
							goalsAgainst: 49,
							goalDifference: -34
						}
					])
				}
			} finally {
				setLoading(false)
			}
		}

		fetchStandings()
	}, [selectedLeagueId])

	if (!selectedLeagueId) {
		return (
			<div className="league-table">
				<div className="no-league-selected">
					<p>Vui lòng chọn một giải đấu để xem bảng xếp hạng</p>
				</div>
			</div>
		)
	}

	return (
		<div className="league-table">
			<div className="table-header">
				<h2>Bảng xếp hạng</h2>
			</div>
			
			{loading && (
				<div className="loading-container">
					<div className="loading-spinner">⏳</div>
					<p>Đang tải bảng xếp hạng...</p>
				</div>
			)}
			
			{error && (
				<div className="error-container">
					<div className="error-icon">⚠️</div>
					<p>{error}</p>
				</div>
			)}
			
			{!loading && !error && standings.length > 0 && (
				<div className="table-container">
					<table className="standings-table">
						<thead>
							<tr>
								<th>Vị trí</th>
								<th>Đội bóng</th>
								<th>Trận</th>
								<th>T</th>
								<th>H</th>
								<th>B</th>
								<th>Điểm</th>
								<th>BT</th>
								<th>BB</th>
								<th>HS</th>
							</tr>
						</thead>
						<tbody>
							{standings.map((standing) => (
								<tr key={standing.team.id} className={standing.position <= 4 ? 'champions-league' : standing.position <= 6 ? 'europa-league' : standing.position >= 18 ? 'relegation' : ''}>
									<td className="position">{standing.position}</td>
									<td className="team">
										<div className="team-info">
											<img 
												src={standing.team.crest} 
												alt={standing.team.name}
												className="team-crest"
												onError={(e) => {
													const target = e.target as HTMLImageElement
													target.style.display = 'none'
												}}
											/>
											<span className="team-name">{standing.team.shortName}</span>
										</div>
									</td>
									<td>{standing.playedGames}</td>
									<td>{standing.won}</td>
									<td>{standing.draw}</td>
									<td>{standing.lost}</td>
									<td className="points">{standing.points}</td>
									<td>{standing.goalsFor}</td>
									<td>{standing.goalsAgainst}</td>
									<td className={standing.goalDifference > 0 ? 'positive' : standing.goalDifference < 0 ? 'negative' : ''}>
										{standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			
			{!loading && !error && standings.length === 0 && (
				<div className="no-data">
					<p>Không có dữ liệu bảng xếp hạng cho giải đấu này</p>
				</div>
			)}
		</div>
	)
}

export default LeagueTable
