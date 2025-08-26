import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import authService, { User } from '../services/authService'

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<boolean>
	register: (email: string, password: string, name: string) => Promise<boolean>
	logout: () => void
	loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Check if user is already authenticated on app load
		const checkAuth = async () => {
			try {
				const currentUser = await authService.getCurrentUser()
				setUser(currentUser)
			} catch (error) {
				console.error('Error checking authentication:', error)
			} finally {
				setLoading(false)
			}
		}

		checkAuth()
	}, [])

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const response = await authService.login({ email, password })
			if (response.success && response.user) {
				setUser(response.user)
				return true
			}
			return false
		} catch (error) {
			console.error('Login error:', error)
			return false
		}
	}

	const register = async (email: string, password: string, name: string): Promise<boolean> => {
		try {
			const response = await authService.register({ email, password, name })
			if (response.success && response.user) {
				setUser(response.user)
				return true
			}
			return false
		} catch (error) {
			console.error('Register error:', error)
			return false
		}
	}

	const logout = () => {
		authService.logout()
		setUser(null)
	}

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		login,
		register,
		logout,
		loading
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
}
