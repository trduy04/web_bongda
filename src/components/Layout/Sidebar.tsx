import React, { useState, useEffect } from 'react'
import { footballApi } from '../../services/footballApi'
import type { Competition } from '../../services/footballApi'
import './Sidebar.scss'

interface League {
	id: number
	name: string
	flag: string
	emblem: string
	isStarred?: boolean
	isPinned?: boolean
}

interface SidebarProps {
	onLeagueSelect?: (leagueId: number) => void
	selectedLeagueId?: number | null
}

const Sidebar: React.FC<SidebarProps> = ({ onLeagueSelect, selectedLeagueId }) => {
	const [leagues, setLeagues] = useState<League[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [pinnedLeagues, setPinnedLeagues] = useState<Set<number>>(new Set())

	// Fetch danh sách giải đấu từ API
	useEffect(() => {
		const fetchCompetitions = async () => {
			try {
				setLoading(true)
				setError(null)
				
				const response = await footballApi.getCompetitions()
				const competitions = response.data.competitions
				
				// Chuyển đổi dữ liệu API sang format hiện tại
				const convertedLeagues: League[] = competitions.map((comp: Competition) => ({
					id: comp.id,
					name: comp.name,
					flag: comp.country?.flag || '🏆',
					emblem: comp.emblem || comp.country?.flag || '🏆',
					isStarred: [2021, 2002, 2014, 2019, 2001].includes(comp.id), // Đánh dấu các giải đấu phổ biến
					isPinned: false
				}))
				
				// Sắp xếp: giải đấu được ghim lên đầu, sau đó là giải đấu phổ biến
				const sortedLeagues = convertedLeagues.sort((a, b) => {
					const aPinned = pinnedLeagues.has(a.id)
					const bPinned = pinnedLeagues.has(b.id)
					
					if (aPinned && !bPinned) return -1
					if (!aPinned && bPinned) return 1
					if (a.isStarred && !b.isStarred) return -1
					if (!a.isStarred && b.isStarred) return 1
					return a.name.localeCompare(b.name)
				})
				
				setLeagues(sortedLeagues)
			} catch (err) {
				console.error('Error fetching competitions:', err)
				setError('Không thể tải danh sách giải đấu')
				// Fallback với một số giải đấu chính
				setLeagues([
					{ id: 2021, name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', emblem: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', isStarred: true, isPinned: false },
					{ id: 2002, name: 'Bundesliga', flag: '🇩🇪', emblem: '🇩🇪', isStarred: true, isPinned: false },
					{ id: 2014, name: 'La Liga', flag: '🇪🇸', emblem: '🇪🇸', isStarred: true, isPinned: false },
					{ id: 2019, name: 'Serie A', flag: '🇮🇹', emblem: '🇮🇹', isStarred: true, isPinned: false },
					{ id: 2001, name: 'UEFA Champions League', flag: '🏆', emblem: '🏆', isStarred: true, isPinned: false },
				])
			} finally {
				setLoading(false)
			}
		}
		
		fetchCompetitions()
	}, [pinnedLeagues])

	const handlePinLeague = (leagueId: number, event: React.MouseEvent) => {
		event.stopPropagation() // Ngăn không cho trigger onClick của league-item
		
		setPinnedLeagues(prev => {
			const newPinned = new Set(prev)
			if (newPinned.has(leagueId)) {
				newPinned.delete(leagueId)
			} else {
				newPinned.add(leagueId)
			}
			return newPinned
		})
	}

	return (
		<aside className="sidebar">
			<div className="leagues-section">
				<h3 className="title">
					GIẢI ĐẤU ĐƯỢC QUAN TÂM
				</h3>
				{loading && (
					<div className="loading-container">
						<div className="loading-spinner">⏳</div>
						<p>Đang tải danh sách giải đấu...</p>
					</div>
				)}
				{error && (
					<div className="error-container">
						<div className="error-icon">⚠️</div>
						<p>{error}</p>
					</div>
				)}
				{!loading && (
					<div className="leagues-list">
						{leagues.map((league) => {
							const isSelected = selectedLeagueId === league.id
							
							return (
								<div
									key={league.id}
									className={`league-item ${isSelected ? 'selected' : ''} ${pinnedLeagues.has(league.id) ? 'pinned' : ''}`}
									onClick={() => onLeagueSelect?.(league.id)}
								>
									<div className="league-info">
										<img 
											src={league.emblem} 
											alt={league.name}
											className="league-emblem"
											onError={(e) => {
												const target = e.target as HTMLImageElement
												target.style.display = 'none'
												target.nextElementSibling?.classList.remove('hidden')
											}}
										/>
										<span className="fallback-flag hidden">{league.flag}</span>
										<span className="name">
											{league.name}
										</span>
									</div>
									<div className="league-actions">
										<button 
											className={`pin-btn ${pinnedLeagues.has(league.id) ? 'pinned' : ''}`}
											onClick={(e) => handlePinLeague(league.id, e)}
											title={pinnedLeagues.has(league.id) ? 'Bỏ ghim' : 'Ghim lên đầu'}
										>
											{pinnedLeagues.has(league.id) ? '📌' : '📍'}
										</button>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
			
			{/* App Download Section */}
			<div className="app-download">
				<div>
					<h4 className="title">Tải ứng dụng bóng đá</h4>
					<div className="app-logo">
						<div className="logo-text">DTDSCORE</div>
					</div>
					<button className="download-btn">
						Tải ngay
					</button>
				</div>
			</div>
		</aside>
	)
}

export default Sidebar
