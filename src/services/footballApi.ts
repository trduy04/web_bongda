const BASE_URL = '/api/football/v4' // Sử dụng Vite proxy

interface ApiResponse<T> {
	data: T
	status: number
	message?: string
}

// Types cho Football Data API
export interface Competition {
	id: number
	name: string
	code: string
	emblem: string
	type: 'LEAGUE' | 'CUP' | 'FRIENDLY'
	country: {
		name: string
		flag: string
	}
	currentSeason: {
		id: number
		startDate: string
		endDate: string
		currentMatchday: number
		winner: any
	}
}

export interface Team {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
	website: string
	founded: number
	clubColors: string
	venue: string
	coach: {
		id: number
		name: string
		nationality: string
	}
}

export interface Match {
	id: number
	competition: {
		id: number
		name: string
		emblem: string
	}
	season: {
		id: number
		startDate: string
		endDate: string
		currentMatchday: number
	}
	date: string
	status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED'
	stage: 'REGULAR_SEASON' | 'QUARTER_FINALS' | 'SEMI_FINALS' | 'FINAL'
	group: string
	lastUpdated: string
	homeTeam: {
		id: number
		name: string
		shortName: string
		tla: string
		crest: string
	}
	awayTeam: {
		id: number
		name: string
		shortName: string
		tla: string
		crest: string
	}
	score: {
		winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null
		duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT'
		fullTime: {
			home: number | null
			away: number | null
		}
		halfTime: {
			home: number | null
			away: number | null
		}
	}
	odds: {
		msg: string
	}
	referees: Array<{
		id: number
		name: string
		type: string
		nationality: string
	}>
}

export interface MatchesResponse {
	count: number
	filters: any
	competition: Competition
	matches: Match[]
}

export interface CompetitionsResponse {
	count: number
	filters: any
	competitions: Competition[]
}

export interface TeamsResponse {
	count: number
	filters: any
	competition: Competition
	season: any
	teams: Team[]
}

export interface Standing {
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

export interface StandingsResponse {
	count: number
	filters: any
	competition: Competition
	season: any
	standings: Array<{
		stage: string
		type: string
		group: string
		table: Standing[]
	}>
}

// API Service functions
export const footballApi = {
	// Lấy danh sách các giải đấu
	async getCompetitions(): Promise<ApiResponse<CompetitionsResponse>> {
		try {
			const response = await fetch(`${BASE_URL}/competitions`)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			return { data, status: response.status }
		} catch (error) {
			console.error('Error fetching competitions:', error)
			throw error
		}
	},

	// Lấy trận đấu của một giải đấu
	async getMatches(competitionId: number, dateFrom?: string, dateTo?: string): Promise<ApiResponse<MatchesResponse>> {
		try {
			let url = `${BASE_URL}/competitions/${competitionId}/matches`
			const params = new URLSearchParams()
			
			// Nếu không có dateFrom, lấy trận đấu từ 7 ngày trước
			if (!dateFrom) {
				const sevenDaysAgo = new Date()
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
				dateFrom = sevenDaysAgo.toISOString().split('T')[0]
			}
			
			// Nếu không có dateTo, lấy trận đấu đến 7 ngày sau
			if (!dateTo) {
				const sevenDaysLater = new Date()
				sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
				dateTo = sevenDaysLater.toISOString().split('T')[0]
			}
			
			params.append('dateFrom', dateFrom)
			params.append('dateTo', dateTo)
			
			url += `?${params.toString()}`
			
			console.log('Fetching from URL:', url)
			
			const response = await fetch(url)
			
			console.log('Response status:', response.status)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			console.log('API Response:', data)
			return { data, status: response.status }
		} catch (error) {
			console.error('Error fetching matches:', error)
			throw error
		}
	},

	// Lấy danh sách đội bóng của một giải đấu
	async getTeams(competitionId: number): Promise<ApiResponse<TeamsResponse>> {
		try {
			const response = await fetch(`${BASE_URL}/competitions/${competitionId}/teams`)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			return { data, status: response.status }
		} catch (error) {
			console.error('Error fetching teams:', error)
			throw error
		}
	},

	// Lấy thông tin chi tiết một trận đấu
	async getMatch(matchId: number): Promise<ApiResponse<Match>> {
		try {
			const response = await fetch(`${BASE_URL}/matches/${matchId}`)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			return { data, status: response.status }
		} catch (error) {
			console.error('Error fetching match:', error)
			throw error
		}
	},

	// Lấy bảng xếp hạng của một giải đấu
	async getStandings(competitionId: number): Promise<ApiResponse<StandingsResponse>> {
		try {
			const response = await fetch(`${BASE_URL}/competitions/${competitionId}/standings`)
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			
			const data = await response.json()
			return { data, status: response.status }
		} catch (error) {
			console.error('Error fetching standings:', error)
			throw error
		}
	}
}

export default footballApi
