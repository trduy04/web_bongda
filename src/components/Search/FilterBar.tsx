import React, { useState, useEffect } from 'react'
import './FilterBar.scss'

interface FilterBarProps {
	onFilterChange: (filter: string) => void
	onDateChange: (date: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onDateChange }) => {
	const [activeFilter, setActiveFilter] = useState('all')
	const [selectedDate, setSelectedDate] = useState('today')
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [selectedCustomDate, setSelectedCustomDate] = useState<Date>(new Date())

	const filters = [
		{ id: 'all', label: 'TẤT CẢ' },
		{ id: 'live', label: 'LIVE' },
		{ id: 'odds', label: 'TỶ LỆ KÈO' },
		{ id: 'finished', label: 'ĐÃ KẾT THÚC' },
		{ id: 'upcoming', label: 'SẮP DIỄN RA' },
	]



	// Tạo ngày tháng động
	const getDateInfo = (offset: number) => {
		const date = new Date()
		date.setDate(date.getDate() + offset)
		
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const weekday = date.toLocaleDateString('vi-VN', { weekday: 'short' }).toUpperCase()
		
		return {
			day,
			month,
			weekday,
			date: date
		}
	}

	const todayInfo = getDateInfo(0)
	const dates = [
		{ 
			id: 'today', 
			label: 'Hôm nay', 
			date: `${todayInfo.day}/${todayInfo.month} ${todayInfo.weekday}`,
			dateObj: todayInfo.date
		}
	]

	const handleFilterClick = (filterId: string) => {
		setActiveFilter(filterId)
		onFilterChange(filterId)
	}

	const handleDateClick = (dateId: string) => {
		setSelectedDate(dateId)
		onDateChange(dateId)
	}

	const handleCustomDateSelect = (date: Date) => {
		setSelectedCustomDate(date)
		setShowDatePicker(false)
		// Gửi ngày được chọn về parent component
		const dateString = date.toISOString().split('T')[0]
		onDateChange(dateString)
	}



	return (
		<div className="filter-bar">
			<div className="filter-content">
				{/* Filter Buttons */}
				<div className="filter-buttons">
					{filters.map((filter) => (
						<button
							key={filter.id}
							onClick={() => handleFilterClick(filter.id)}
							className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
						>
							{filter.label}
						</button>
					))}
				</div>

				{/* Date Selector */}
				<div className="date-selector">
					<button className="nav-btn">
						<span>‹</span>
					</button>
					
					<div className="date-buttons">
						{dates.map((date) => (
							<button
								key={date.id}
								onClick={() => setShowDatePicker(!showDatePicker)}
								className={`date-btn ${selectedDate === date.id ? 'active' : ''}`}
							>
								<div className="date-content">
									<span>📅</span>
									<span>{date.date}</span>
								</div>
							</button>
						))}
					</div>
					
					<button className="nav-btn">
						<span>›</span>
					</button>
				</div>
			</div>

			{/* Date Picker Modal */}
			{showDatePicker && (
				<div className="date-picker-modal">
					<div className="date-picker-content">
						<div className="date-picker-header">
							<h3>Chọn ngày</h3>
							<button 
								className="close-btn"
								onClick={() => setShowDatePicker(false)}
							>
								✕
							</button>
						</div>
						<div className="date-picker-body">
							<input
								type="date"
								value={selectedCustomDate.toISOString().split('T')[0]}
								onChange={(e) => {
									const newDate = new Date(e.target.value)
									setSelectedCustomDate(newDate)
								}}
								className="date-input"
							/>
							<div className="date-picker-actions">
								<button 
									className="cancel-btn"
									onClick={() => setShowDatePicker(false)}
								>
									Hủy
								</button>
								<button 
									className="confirm-btn"
									onClick={() => handleCustomDateSelect(selectedCustomDate)}
								>
									Xác nhận
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default FilterBar
