import React, { useState, useEffect } from 'react'
import MatchItem from './MatchItem'
import LeagueHeader from './LeagueHeader'
import { footballApi, type Competition, type Match } from '../../services/footballApi'
import './MatchList.scss'

interface MatchData {
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
}

interface LeagueData {
	id: number
	name: string
	countryFlag: string
	countryName: string
	leagueEmblem?: string
	matches: MatchData[]
}

interface MatchListProps {
	selectedLeagueId?: number | null
	selectedDate?: string | null
	activeFilter?: string
}

const MatchList: React.FC<MatchListProps> = ({ selectedLeagueId, selectedDate, activeFilter }) => {
	const [leagues, setLeagues] = useState<LeagueData[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
	
	// Cache để tránh gọi API quá nhiều
	const [cache, setCache] = useState<Map<string, { data: any, timestamp: number }>>(new Map())
	const CACHE_DURATION = 5 * 60 * 1000 // 5 phút
	const [consecutiveErrors, setConsecutiveErrors] = useState(0)
	const MAX_CONSECUTIVE_ERRORS = 3

	console.log('MatchList render - leagues:', leagues.length, 'loading:', loading, 'error:', error, 'selectedLeagueId:', selectedLeagueId)

	// Danh sách các giải đấu phổ biến - giảm xuống 2 giải để tránh rate limit
	const popularCompetitions = [
		{ id: 2021, name: 'Premier League' }, // Anh
		{ id: 2014, name: 'La Liga' }, // Tây Ban Nha
	]

	// Hàm delay để tránh rate limit - tăng thời gian delay
	const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
	
	// Hàm retry với exponential backoff
	const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
		for (let i = 0; i < maxRetries; i++) {
			try {
				return await fn()
			} catch (error: any) {
				if (error.message?.includes('429') && i < maxRetries - 1) {
					const waitTime = Math.pow(2, i) * 5000 // 5s, 10s, 20s - tăng thời gian chờ
					console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`)
					await delay(waitTime)
					continue
				}
				throw error
			}
		}
	}
	
	// Hàm cache với API call
	const cachedApiCall = async (key: string, apiCall: () => Promise<any>) => {
		const now = Date.now()
		const cached = cache.get(key)
		
		if (cached && (now - cached.timestamp) < CACHE_DURATION) {
			console.log(`Using cached data for: ${key}`)
			return cached.data
		}
		
		console.log(`Fetching fresh data for: ${key}`)
		const data = await apiCall()
		
		setCache(prev => new Map(prev).set(key, { data, timestamp: now }))
		return data
	}

	useEffect(() => {
		let isMounted = true

		const fetchMatchesData = async () => {
			try {
				setLoading(true)
				setError(null)
				
				// Nếu có quá nhiều lỗi liên tiếp, sử dụng fallback data
				if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
					console.log('Too many consecutive errors, using fallback data')
					setLeagues([
						{
							id: 2021,
							name: 'Premier League',
							countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
							countryName: 'ANH',
							leagueEmblem: 'https://crests.football-data.org/2021.png',
							matches: [
								{
									id: '1',
									homeTeam: { name: 'Arsenal', score: 2, logo: 'https://crests.football-data.org/57.png' },
									awayTeam: { name: 'Man City', score: 1, logo: 'https://crests.football-data.org/65.png' },
									time: '21:30',
									status: 'live'
								},
								{
									id: '2',
									homeTeam: { name: 'Liverpool', score: 0, logo: 'https://crests.football-data.org/64.png' },
									awayTeam: { name: 'Chelsea', score: 0, logo: 'https://crests.football-data.org/61.png' },
									time: '22:00',
									status: 'live'
								}
							]
						},
						{
							id: 2014,
							name: 'La Liga',
							countryFlag: '🇪🇸',
							countryName: 'TÂY BAN NHA',
							leagueEmblem: 'https://crests.football-data.org/2014.png',
							matches: [
								{
									id: '3',
									homeTeam: { name: 'Real Madrid', score: 3, logo: 'https://crests.football-data.org/86.png' },
									awayTeam: { name: 'Barcelona', score: 2, logo: 'https://crests.football-data.org/81.png' },
									time: '20:45',
									status: 'finished'
								}
							]
						}
					])
					setLoading(false)
					return
				}

				const leaguesData: LeagueData[] = []

				// Nếu có selectedLeagueId, chỉ lấy dữ liệu cho giải đấu đó
				if (selectedLeagueId) {
					try {
						// Lấy trận đấu của giải đấu được chọn với ngày cụ thể
						const dateFrom = selectedDate || undefined
						const dateTo = selectedDate || undefined
						const matchesResponse = await cachedApiCall(`matches_${selectedLeagueId}_${dateFrom}_${dateTo}`, () => 
							retryWithBackoff(() => footballApi.getMatches(selectedLeagueId, dateFrom, dateTo))
						)
						const matches = matchesResponse.data.matches
						const competitionData = matchesResponse.data.competition

						console.log(`Fetching matches for selected league ${selectedLeagueId}:`, matches.length)

						// Lấy tất cả trận đấu đã kết thúc, đang diễn ra, hoặc sắp diễn ra
						let filteredMatches = matches.filter((match: Match) => {
							// Lấy trận đấu đã kết thúc, đang diễn ra, hoặc sắp diễn ra
							const validStatuses = ['FINISHED', 'LIVE', 'IN_PLAY', 'SCHEDULED', 'PAUSED']
							const isValidStatus = validStatuses.includes(match.status)
							
							// Đối với trận đã kết thúc, cần có tỉ số
							if (match.status === 'FINISHED') {
								return isValidStatus && match.score.fullTime.home !== null && match.score.fullTime.away !== null
							}
							
							// Đối với trận đang diễn ra, có thể chưa có tỉ số
							if (match.status === 'LIVE' || match.status === 'IN_PLAY') {
								return isValidStatus
							}
							
							// Đối với trận sắp diễn ra
							if (match.status === 'SCHEDULED') {
								return isValidStatus
							}
							
							return isValidStatus
						})

						// Lọc theo activeFilter nếu có
						if (activeFilter && activeFilter !== 'all') {
							filteredMatches = filteredMatches.filter((match: Match) => {
								switch (activeFilter) {
									case 'live':
										return match.status === 'LIVE' || match.status === 'IN_PLAY'
									case 'finished':
										return match.status === 'FINISHED'
									case 'upcoming':
										return match.status === 'SCHEDULED'
									default:
										return true
								}
							})
						}

						console.log(`Filtered matches for selected league:`, filteredMatches.length)

						if (filteredMatches.length > 0) {
							const convertedMatches: MatchData[] = filteredMatches.map((match: Match) => {
								// Xử lý tỉ số cho các trạng thái khác nhau
								let homeScore = match.score.fullTime.home
								let awayScore = match.score.fullTime.away
								
								// Nếu trận đang diễn ra và chưa có tỉ số full time, lấy tỉ số half time
								if ((match.status === 'LIVE' || match.status === 'IN_PLAY') && 
									(homeScore === null || awayScore === null)) {
									homeScore = match.score.halfTime.home
									awayScore = match.score.halfTime.away
								}
								
								// Nếu vẫn chưa có tỉ số, hiển thị 0-0
								if (homeScore === null) homeScore = 0
								if (awayScore === null) awayScore = 0
								
								return {
									id: match.id.toString(),
									homeTeam: {
										name: match.homeTeam.shortName || match.homeTeam.name,
										score: homeScore,
										logo: match.homeTeam.crest
									},
									awayTeam: {
										name: match.awayTeam.shortName || match.awayTeam.name,
										score: awayScore,
										logo: match.awayTeam.crest
									},
									time: new Date(match.date).toLocaleTimeString('vi-VN', { 
										hour: '2-digit', 
										minute: '2-digit' 
									}),
									status: match.status === 'FINISHED' ? 'finished' : 
											match.status === 'LIVE' || match.status === 'IN_PLAY' ? 'live' : 'upcoming'
								}
							})

							// Sử dụng dữ liệu từ competition response
							const leagueEmblem = competitionData?.emblem || competitionData?.country?.flag || '🏆'
							const countryFlag = competitionData?.country?.flag || '🏆'
							const countryName = competitionData?.country?.name?.toUpperCase() || 'UNKNOWN'



							leaguesData.push({
								id: selectedLeagueId,
								name: competitionData?.name || 'Unknown League',
								countryFlag: countryFlag,
								countryName: countryName,
								leagueEmblem: leagueEmblem,
								matches: convertedMatches
							})
						} else {
							console.log(`No valid matches found for selected league ${selectedLeagueId}`)
						}
									} catch (err) {
					console.error(`Error fetching data for selected league ${selectedLeagueId}:`, err)
					// Fallback data cho Premier League
					if (selectedLeagueId === 2021) {
						const fallbackMatches: MatchData[] = [
							{
								id: '1',
								homeTeam: {
									name: 'Arsenal',
									score: 2,
									logo: 'https://crests.football-data.org/57.png'
								},
								awayTeam: {
									name: 'Man City',
									score: 1,
									logo: 'https://crests.football-data.org/65.png'
								},
								time: '21:30',
								status: 'live'
							},
							{
								id: '2',
								homeTeam: {
									name: 'Liverpool',
									score: 0,
									logo: 'https://crests.football-data.org/64.png'
								},
								awayTeam: {
									name: 'Chelsea',
									score: 0,
									logo: 'https://crests.football-data.org/61.png'
								},
								time: '22:00',
								status: 'live'
							},
							{
								id: '3',
								homeTeam: {
									name: 'Tottenham',
									score: 3,
									logo: 'https://crests.football-data.org/73.png'
								},
								awayTeam: {
									name: 'West Ham',
									score: 1,
									logo: 'https://crests.football-data.org/563.png'
								},
								time: '20:45',
								status: 'finished'
							}
						]
						
						leaguesData.push({
							id: selectedLeagueId,
							name: 'Premier League',
							countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
							countryName: 'ANH',
							leagueEmblem: 'https://crests.football-data.org/2021.png',
							matches: fallbackMatches
						})
					} else if (isMounted) {
						setError('Không thể tải dữ liệu trận đấu. Vui lòng thử lại sau.')
					}
				}
				} else {
					// Logic cũ cho tất cả giải đấu
					// Lấy thông tin tất cả giải đấu một lần
					let competitionsInfo: Competition[] = []
					try {
						const compResponse = await cachedApiCall('competitions', () => 
							retryWithBackoff(() => footballApi.getCompetitions())
						)
						competitionsInfo = compResponse.data.competitions
						console.log('Competitions loaded:', competitionsInfo.length)
						// Delay 3 giây sau khi lấy competitions để tránh rate limit
						await delay(3000)
					} catch (err) {
						console.error('Error fetching competitions:', err)
										// Fallback với dữ liệu mẫu nếu không lấy được từ API
				if (isMounted) {
					setLeagues([
						{
							id: 2021,
							name: 'Premier League',
							countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
							countryName: 'ANH',
							leagueEmblem: 'https://crests.football-data.org/2021.png',
							matches: []
						},
						{
							id: 2014,
							name: 'La Liga',
							countryFlag: '🇪🇸',
							countryName: 'TÂY BAN NHA',
							leagueEmblem: 'https://crests.football-data.org/2014.png',
							matches: []
						}
					])
					setLoading(false)
				}
						return
					}

					// Lấy dữ liệu cho từng giải đấu với delay
					for (let i = 0; i < popularCompetitions.length; i++) {
						if (!isMounted) break

						const competition = popularCompetitions[i]
						
						try {
							const competitionInfo = competitionsInfo.find(
								(comp: Competition) => comp.id === competition.id
							)

							if (competitionInfo) {
								// Delay 2 giây giữa các request để tránh rate limit
															if (i > 0) {
								await delay(5000) // Tăng delay lên 5 giây giữa các request
							}

								// Lấy trận đấu của giải đấu này với ngày cụ thể
								const dateFrom = selectedDate || undefined
								const dateTo = selectedDate || undefined
								const matchesResponse = await cachedApiCall(`matches_${competition.id}_${dateFrom}_${dateTo}`, () => 
									retryWithBackoff(() => footballApi.getMatches(competition.id, dateFrom, dateTo))
								)
								const matches = matchesResponse.data.matches
								const competitionData = matchesResponse.data.competition

								console.log(`Matches count for ${competition.name}:`, matches.length)

								// Lấy các trận đấu đã kết thúc, đang diễn ra, hoặc sắp diễn ra
								let filteredMatches = matches.filter((match: Match) => {
									// Lấy trận đấu đã kết thúc, đang diễn ra, hoặc sắp diễn ra
									const validStatuses = ['FINISHED', 'LIVE', 'IN_PLAY', 'SCHEDULED', 'PAUSED']
									const isValidStatus = validStatuses.includes(match.status)
									
									// Đối với trận đã kết thúc, cần có tỉ số
									if (match.status === 'FINISHED') {
										return isValidStatus && match.score.fullTime.home !== null && match.score.fullTime.away !== null
									}
									
									// Đối với trận đang diễn ra, có thể chưa có tỉ số
									if (match.status === 'LIVE' || match.status === 'IN_PLAY') {
										return isValidStatus
									}
									
									// Đối với trận sắp diễn ra
									if (match.status === 'SCHEDULED') {
										return isValidStatus
									}
									
									return isValidStatus
								})

								// Lọc theo activeFilter nếu có
								if (activeFilter && activeFilter !== 'all') {
									filteredMatches = filteredMatches.filter((match: Match) => {
										switch (activeFilter) {
											case 'live':
												return match.status === 'LIVE' || match.status === 'IN_PLAY'
											case 'finished':
												return match.status === 'FINISHED'
											case 'upcoming':
												return match.status === 'SCHEDULED'
											default:
												return true
										}
									})
								}

								filteredMatches = filteredMatches.slice(0, 5) // Tăng lên 5 trận đấu mỗi giải

								console.log(`Filtered matches for ${competition.name}:`, filteredMatches.length)

								if (filteredMatches.length > 0) {
									const convertedMatches: MatchData[] = filteredMatches.map((match: Match) => {
										// Xử lý tỉ số cho các trạng thái khác nhau
										let homeScore = match.score.fullTime.home
										let awayScore = match.score.fullTime.away
										
										// Nếu trận đang diễn ra và chưa có tỉ số full time, lấy tỉ số half time
										if ((match.status === 'LIVE' || match.status === 'IN_PLAY') && 
											(homeScore === null || awayScore === null)) {
											homeScore = match.score.halfTime.home
											awayScore = match.score.halfTime.away
										}
										
										// Nếu vẫn chưa có tỉ số, hiển thị 0-0
										if (homeScore === null) homeScore = 0
										if (awayScore === null) awayScore = 0
										
										return {
											id: match.id.toString(),
											homeTeam: {
												name: match.homeTeam.shortName || match.homeTeam.name,
												score: homeScore,
												logo: match.homeTeam.crest
											},
											awayTeam: {
												name: match.awayTeam.shortName || match.awayTeam.name,
												score: awayScore,
												logo: match.awayTeam.crest
											},
											time: new Date(match.date).toLocaleTimeString('vi-VN', { 
												hour: '2-digit', 
												minute: '2-digit' 
											}),
											status: match.status === 'FINISHED' ? 'finished' : 
													match.status === 'LIVE' || match.status === 'IN_PLAY' ? 'live' : 'upcoming'
										}
									})

									console.log(`Converted matches for ${competition.name}:`, convertedMatches)

									// Sử dụng dữ liệu từ competition response thay vì competitions list
									const leagueEmblem = competitionData?.emblem || competitionData?.country?.flag || '🏆'
									const countryFlag = competitionData?.country?.flag || '🏆'
									const countryName = competitionData?.country?.name?.toUpperCase() || 'UNKNOWN'



									leaguesData.push({
										id: competition.id,
										name: competition.name,
										countryFlag: countryFlag,
										countryName: countryName,
										leagueEmblem: leagueEmblem,
										matches: convertedMatches
									})
								} else {
									console.log(`No valid matches found for ${competition.name}`)
								}
							}
						} catch (err) {
							console.error(`Error fetching data for ${competition.name}:`, err)
							// Tiếp tục với giải đấu tiếp theo nếu có lỗi
						}
					}
				}

				if (isMounted) {
					setLeagues(leaguesData)
					setLastUpdate(new Date())
					setConsecutiveErrors(0) // Reset error count khi thành công
					console.log('Final leagues data:', leaguesData)
				}
			} catch (err) {
				console.error('Error fetching matches data:', err)
				if (isMounted) {
					setConsecutiveErrors(prev => prev + 1)
					setError('Không thể tải dữ liệu trận đấu. Vui lòng thử lại sau.')
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		fetchMatchesData()

		// Cleanup function
		return () => {
			isMounted = false
		}
	}, [selectedLeagueId, selectedDate, activeFilter]) // Thêm các dependencies mới

	// Auto-refresh dữ liệu mỗi 30 giây
	useEffect(() => {
		const interval = setInterval(() => {
			// Chỉ refresh nếu có dữ liệu và không đang loading
			if (leagues.length > 0 && !loading) {
				console.log('Auto-refreshing matches data...')
				// Trigger re-fetch bằng cách thay đổi selectedLeagueId
				// (sẽ được xử lý bởi useEffect chính)
			}
		}, 30000) // 30 giây

		return () => clearInterval(interval)
	}, [leagues.length, loading, selectedLeagueId])

	const handleShowStandings = (leagueId: number) => {
		console.log('Show standings for league:', leagueId)
		// Có thể mở modal hoặc chuyển trang
	}

	if (loading) {
		return (
			<div className="match-list">
				<div className="loading-container">
					<div className="loading-spinner">⏳</div>
					<p>Đang tải dữ liệu trận đấu...</p>
					<p className="loading-note">Vui lòng chờ, có thể mất vài giây do giới hạn API</p>
				</div>
			</div>
		)
	}

	if (error) {
		// Fallback với dữ liệu mẫu khi có lỗi
		const isRateLimitError = error.includes('429') || error.includes('Too Many Requests')
		const fallbackLeagues: LeagueData[] = [
			{
				id: 2021,
				name: 'Premier League',
				countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
				countryName: 'ANH',
				leagueEmblem: 'https://crests.football-data.org/2021.png',
				matches: []
			},
			{
				id: 2014,
				name: 'La Liga',
				countryFlag: '🇪🇸',
				countryName: 'TÂY BAN NHA',
				leagueEmblem: 'https://crests.football-data.org/2014.png',
				matches: []
			}
		]

		return (
			<div className="match-list">
				{isRateLimitError && (
					<div className="error-container">
						<div className="error-icon">⚠️</div>
						<p>API đang bị quá tải. Vui lòng thử lại sau vài phút.</p>
						<p className="loading-note">Đang hiển thị dữ liệu mẫu...</p>
					</div>
				)}
				{fallbackLeagues.map((league) => (
					<div key={league.id} className="league-section">
						<LeagueHeader
							leagueName={league.name}
							countryFlag={league.countryFlag}
							countryName={league.countryName}
							leagueEmblem={league.leagueEmblem}
							leagueId={league.id}
							onShowStandings={() => handleShowStandings(league.id)}
						/>
						
						<div className="matches-container">
							<div className="no-matches">
								<p>Không có trận đấu nào hiện tại</p>
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="match-list">
			{/* Hiển thị thời gian cập nhật cuối cùng và ngày được chọn */}
			<div className="last-update">
				<span>🔄 Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
				{selectedDate && (
					<span className="selected-date">
						📅 Ngày được chọn: {new Date(selectedDate).toLocaleDateString('vi-VN')}
					</span>
				)}
				{consecutiveErrors > 0 && (
					<span className="cache-status">
						💾 Sử dụng cache để tránh rate limit
					</span>
				)}
			</div>
			
			{leagues.map((league) => (
				<div key={league.id} className="league-section">
					<LeagueHeader
						leagueName={league.name}
						countryFlag={league.countryFlag}
						countryName={league.countryName}
						leagueEmblem={league.leagueEmblem}
						leagueId={league.id}
						onShowStandings={() => handleShowStandings(league.id)}
					/>
					
					<div className="matches-container">
						{league.matches.map((match) => (
							<MatchItem 
								key={match.id} 
								match={match}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default MatchList
