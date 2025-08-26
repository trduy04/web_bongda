import React, { useState } from 'react'
import './LeagueHeader.scss'

interface LeagueHeaderProps {
	leagueName: string
	countryFlag: string
	countryName: string
	leagueEmblem?: string
	leagueId?: number
	onShowStandings?: () => void
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ 
	leagueName, 
	countryFlag, 
	countryName,
	leagueEmblem,
	leagueId,
	onShowStandings 
}) => {
	const [isStarred, setIsStarred] = useState(false)



	const handleShowStandings = () => {
		// Nếu có leagueId, mở bảng xếp hạng từ Flashscore
		if (leagueId) {
			// Mở trong tab mới
			window.open(`https://www.flashscore.vn/bang-xep-hang/KKay4EE8/OEEq9Yvp/#/OEEq9Yvp/table/overall`, '_blank')
		} else if (onShowStandings) {
			// Fallback cho các giải đấu khác
			onShowStandings()
		}
	}

	return (
		<div className="league-header">
			<div className="league-info">
				<button
					onClick={() => setIsStarred(!isStarred)}
					className={`star-btn ${isStarred ? 'active' : ''}`}
				>
					<span className="star-icon">☆</span>
				</button>
				
				<div className="league-emblem">
					{leagueEmblem && leagueEmblem.startsWith('http') ? (
						<img 
							src={leagueEmblem} 
							alt={leagueName}
							className="emblem-img"
							onError={(e) => {
								const target = e.target as HTMLImageElement
								target.style.display = 'none'
								target.nextElementSibling?.classList.remove('hidden')
							}}
						/>
					) : null}
					<span className={`fallback-flag ${(leagueEmblem && leagueEmblem.startsWith('http')) ? 'hidden' : ''}`}>
						{countryFlag}
					</span>
				</div>
				
				<div className="league-name">
					{leagueName}
				</div>
			</div>
			
			<button 
				className="standings-link"
				onClick={handleShowStandings}
			>
				Bảng xếp hạng
			</button>
		</div>
	)
}

export default LeagueHeader
