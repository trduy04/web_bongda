import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import FootballSearch from './components/Search'
import { AuthProvider } from './contexts/AuthContext'

function App() {
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (query: string) => {
		setSearchQuery(query)
	}

	return (
		<AuthProvider>
			<Router>
				<div className="min-h-screen bg-slate-900">
					<Header onSearch={handleSearch} />
					<Routes>
						<Route path="/" element={<Navigate to="/bong-da" replace />} />
						<Route path="/bong-da" element={<FootballSearch searchQuery={searchQuery} />} />
						<Route path="/tennis" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Tennis - Đang phát triển</div>} />
						<Route path="/cau-long" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Cầu Lông - Đang phát triển</div>} />
						<Route path="/bong-ro" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Bóng Rổ - Đang phát triển</div>} />
						<Route path="/bong-chuyen" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Bóng Chuyền - Đang phát triển</div>} />
						<Route path="/futsal" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Futsal - Đang phát triển</div>} />
						<Route path="/hockey" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Hockey - Đang phát triển</div>} />
						<Route path="/quan-tam" element={<div className="p-8 text-center text-white bg-slate-900 min-h-screen">Trang Quan Tâm - Đang phát triển</div>} />
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App

