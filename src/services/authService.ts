const API_BASE_URL = 'http://localhost:5000/api'

export interface User {
	id: number
	email: string
	name: string
}

export interface AuthResponse {
	success: boolean
	message: string
	token?: string
	user?: User
	error?: string
}

export interface LoginData {
	email: string
	password: string
}

export interface RegisterData {
	email: string
	password: string
	name: string
}

class AuthService {
	private token: string | null = null
	private user: User | null = null

	constructor() {
		// Load token and user from localStorage on initialization
		this.token = localStorage.getItem('authToken')
		const userStr = localStorage.getItem('user')
		if (userStr) {
			try {
				this.user = JSON.parse(userStr)
			} catch (error) {
				console.error('Error parsing user data:', error)
				this.logout()
			}
		}
	}

	async login(credentials: LoginData): Promise<AuthResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials)
			})

			const data: AuthResponse = await response.json()

			if (response.ok && data.success && data.token && data.user) {
				this.token = data.token
				this.user = data.user
				localStorage.setItem('authToken', data.token)
				localStorage.setItem('user', JSON.stringify(data.user))
			}

			return data
		} catch (error) {
			return {
				success: false,
				message: 'Không thể kết nối đến server',
				error: 'Không thể kết nối đến server'
			}
		}
	}

	async register(userData: RegisterData): Promise<AuthResponse> {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData)
			})

			const data: AuthResponse = await response.json()

			if (response.ok && data.success && data.token && data.user) {
				this.token = data.token
				this.user = data.user
				localStorage.setItem('authToken', data.token)
				localStorage.setItem('user', JSON.stringify(data.user))
			}

			return data
		} catch (error) {
			return {
				success: false,
				message: 'Không thể kết nối đến server',
				error: 'Không thể kết nối đến server'
			}
		}
	}

	async getCurrentUser(): Promise<User | null> {
		if (!this.token) {
			return null
		}

		try {
			const response = await fetch(`${API_BASE_URL}/auth/me`, {
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-Type': 'application/json',
				}
			})

			if (response.ok) {
				const data = await response.json()
				return data.user
			} else {
				this.logout()
				return null
			}
		} catch (error) {
			console.error('Error fetching current user:', error)
			return null
		}
	}

	logout(): void {
		this.token = null
		this.user = null
		localStorage.removeItem('authToken')
		localStorage.removeItem('user')
	}

	isAuthenticated(): boolean {
		return !!this.token
	}

	getToken(): string | null {
		return this.token
	}

	getUser(): User | null {
		return this.user
	}

	// Helper method to get auth headers for API calls
	getAuthHeaders(): Record<string, string> {
		return {
			'Authorization': `Bearer ${this.token}`,
			'Content-Type': 'application/json',
		}
	}
}

export const authService = new AuthService()
export default authService
