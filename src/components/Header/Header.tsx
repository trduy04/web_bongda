import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import { LoginModal } from '../Auth'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
	onSearch: (query: string) => void
}

function Header({ onSearch }: HeaderProps) {
	const location = useLocation()
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const { user, isAuthenticated, logout } = useAuth()

	const sports = [
		{ id: 'quan-tam', icon: '⭐', name: 'QUAN TÂM', count: '0', path: '/quan-tam' },
		{ id: 'bong-da', icon: '⚽', name: 'BÓNG ĐÁ', path: '/bong-da' },
		{ id: 'tennis', icon: '🎾', name: 'TENNIS', path: '/tennis' },
		{ id: 'cau-long', icon: '🏸', name: 'CẦU LÔNG', path: '/cau-long' },
		{ id: 'bong-ro', icon: '🏀', name: 'BÓNG RỔ', path: '/bong-ro' },
		{ id: 'bong-chuyen', icon: '🏐', name: 'BÓNG CHUYỀN', path: '/bong-chuyen' },
		{ id: 'futsal', icon: '⚽', name: 'FUTSAL', path: '/futsal' },
		{ id: 'hockey', icon: '🏒', name: 'HOCKEY', path: '/hockey' },
	]

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			onSearch(searchQuery.trim())
		}
	}

	const handleLoginClick = () => {
		setIsLoginModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsLoginModalOpen(false)
	}

	const handleLogout = () => {
		logout()
	}

	const handleFootballClick = () => {
		navigate('/')
	}

	return (
		<header className="header">
			<div className="header-top">
				<div className="logo">
					<span className="logo-arrow">▶</span>
					DTDSCORE
				</div>
				
				<div className="header-actions">
					<form onSubmit={handleSearch} className="search-container">
						<span className="search-icon">🔍</span>
						<input
							type="text"
							className="search-input"
							placeholder="Tìm kiếm đội bóng, trận đấu..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							type="submit"
							className="search-btn"
							disabled={!searchQuery.trim()}
						>
							Tìm
						</button>
					</form>
					
					{isAuthenticated ? (
						<div className="user-section">
							<span className="user-name">👤 {user?.name}</span>
							<button className="action-btn logout-btn" onClick={handleLogout}>
								🚪 ĐĂNG XUẤT
							</button>
						</div>
					) : (
						<button className="action-btn login-btn" onClick={handleLoginClick}>
							👤 ĐĂNG NHẬP
						</button>
					)}
					
					<button className="action-btn">
						☰
					</button>
				</div>
			</div>

			<nav className="navigation">
				{sports.map((sport) => {
					// Button bóng đá active khi ở trang home (/) hoặc /bong-da
					const isActive = sport.id === 'bong-da' 
						? (location.pathname === '/' || location.pathname === sport.path)
						: location.pathname === sport.path
					
					// Nếu là bóng đá (trang mặc định), render như button thông thường
					if (sport.id === 'bong-da') {
						return (
							<button
								key={sport.id}
								className={`sport-btn ${isActive ? 'active' : ''}`}
								onClick={handleFootballClick}
							>
								<span className="sport-icon">{sport.icon}</span>
								<span>{sport.name}</span>
								{sport.count && <span className="sport-count">({sport.count})</span>}
							</button>
						)
					}
					
					// Các môn thể thao khác vẫn render như Link
					return (
						<Link
							key={sport.id}
							to={sport.path}
							className={`sport-btn ${isActive ? 'active' : ''}`}
						>
							<span className="sport-icon">{sport.icon}</span>
							<span>{sport.name}</span>
							{sport.count && <span className="sport-count">({sport.count})</span>}
						</Link>
					)
				})}
				
				<div className="more-sports">
					<span>CÁC MÔN KHÁC</span>
					<span className="dropdown-arrow">⌄</span>
				</div>
			</nav>
			
			<LoginModal 
				isOpen={isLoginModalOpen} 
				onClose={handleCloseModal} 
			/>
		</header>
	)
}

export default Header
