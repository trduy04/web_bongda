import React, { useState } from 'react'
import './MatchItem.scss'

interface Match {
	id: string
	homeTeam: {
		name: string
		score?: number | null
		logo: string
	}
	awayTeam: {
		name: string
		score?: number | null
		logo: string
	}
	time: string
	status: 'finished' | 'live' | 'upcoming'
	hasTV?: boolean
}

interface MatchItemProps {
	match: Match
}

const MatchItem: React.FC<MatchItemProps> = ({ match }) => {
	const [isFavorite, setIsFavorite] = useState(false)

	const getStatusText = (status: string) => {
		switch (status) {
			case 'finished':
				return 'Kết thúc'
			case 'live':
				return 'LIVE'
			case 'upcoming':
				return match.time
			default:
				return match.time
		}
	}

	return (
		<div className="match-item">
			{/* Status and Favorite */}
			<div className="match-status">
				<button
					onClick={() => setIsFavorite(!isFavorite)}
					className={`favorite-btn ${isFavorite ? 'active' : ''}`}
				>
					<span className="star-icon">☆</span>
				</button>
				<div className="status-text">
					{getStatusText(match.status)}
				</div>
			</div>

			{/* Match Details */}
			<div className="match-details">
				{/* Home Team */}
				<div className="team home-team">
					<div className="team-logo">
						<img src={match.homeTeam.logo} alt={match.homeTeam.name} />
					</div>
					<div className="team-name">
						{match.homeTeam.name}
					</div>
					{match.homeTeam.score !== undefined && match.homeTeam.score !== null && (
						<div className="team-score">
							{match.homeTeam.score}
						</div>
					)}
				</div>

				{/* Away Team */}
				<div className="team away-team">
					{match.awayTeam.score !== undefined && match.awayTeam.score !== null && (
						<div className="team-score">
							{match.awayTeam.score}
						</div>
					)}
					<div className="team-name">
						{match.awayTeam.name}
					</div>
					<div className="team-logo">
						<img src={match.awayTeam.logo} alt={match.awayTeam.name} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default MatchItem
