import React, { useState } from 'react'
import { Sidebar } from '../Layout'
import FilterBar from './FilterBar'
import { MatchList, LeagueTable } from '../Match'
import './FootballSearch.scss'

interface FootballSearchProps {
	searchQuery: string
}

const FootballSearch: React.FC<FootballSearchProps> = ({ searchQuery }) => {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedDate, setSelectedDate] = useState('today')
	const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null)
	const [viewMode, setViewMode] = useState<'matches' | 'table'>('matches')
	const [customDate, setCustomDate] = useState<string | null>(null)

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter)
		// Có thể thêm logic lọc trận đấu theo filter ở đây
	}

	const handleDateChange = (date: string) => {
		setSelectedDate(date)
		
		// Xử lý ngày được chọn
		if (date === 'today') {
			setCustomDate(null)
		} else {
			// Ngày tùy chỉnh từ date picker
			setCustomDate(date)
		}
	}

	const handleLeagueSelect = (leagueId: number) => {
		console.log('Selected league:', leagueId)
		setSelectedLeagueId(leagueId)
	}

	const handleViewModeChange = (mode: 'matches' | 'table') => {
		setViewMode(mode)
	}

	return (
		<div className="football-search">
			<div className="container">
				<div className="content-wrapper">
					{/* Left Sidebar */}
					<div className="sidebar-container">
						<Sidebar 
							onLeagueSelect={handleLeagueSelect}
							selectedLeagueId={selectedLeagueId}
						/>
					</div>

					{/* Main Content */}
					<div className="main-content">
						<FilterBar 
							onFilterChange={handleFilterChange}
							onDateChange={handleDateChange}
						/>
						
						{/* View Mode Toggle */}
						{selectedLeagueId && (
							<div className="view-mode-toggle">
								<button 
									className={`toggle-btn ${viewMode === 'matches' ? 'active' : ''}`}
									onClick={() => handleViewModeChange('matches')}
								>
									📅 Trận đấu
								</button>
								<button 
									className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
									onClick={() => handleViewModeChange('table')}
								>
									🏆 Bảng xếp hạng
								</button>
							</div>
						)}
						
						{/* Content based on view mode */}
						{viewMode === 'matches' ? (
							<MatchList 
								selectedLeagueId={selectedLeagueId} 
								selectedDate={customDate}
								activeFilter={activeFilter}
							/>
						) : (
							<LeagueTable selectedLeagueId={selectedLeagueId} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default FootballSearch
