import React, { useState } from 'react'
import './LoginSection.scss'
import BenefitsList from './BenefitsList'
import SocialLoginButtons from './SocialLoginButtons'
import LegalDisclaimer from './LegalDisclaimer'
import authService from '../../../services/authService'
import type { LoginData, RegisterData } from '../../../services/authService'

interface LoginFormData {
	email: string
	password: string
	name?: string
}

interface LoginResponse {
	success: boolean
	message: string
	token?: string
	user?: {
		id: number
		email: string
		name: string
	}
	error?: string
}

function LoginSection() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: ''
	})
	
	const [errors, setErrors] = useState<Partial<LoginFormData>>({})
	const [isLoading, setIsLoading] = useState(false)
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [message, setMessage] = useState('')

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginFormData> = {}

		// Validate email
		if (!formData.email) {
			newErrors.email = 'Email là bắt buộc'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email không hợp lệ'
		}

		// Validate password
		if (!formData.password) {
			newErrors.password = 'Mật khẩu là bắt buộc'
		} else if (formData.password.length < 6) {
			newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
		}

		// Validate name for registration
		if (!isLoginMode && !formData.name) {
			newErrors.name = 'Họ tên là bắt buộc'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
		
		// Clear error when user starts typing
		if (errors[name as keyof LoginFormData]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setMessage('')

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			let response
			
			if (isLoginMode) {
				const loginData: LoginData = {
					email: formData.email,
					password: formData.password
				}
				response = await authService.login(loginData)
			} else {
				const registerData: RegisterData = {
					email: formData.email,
					password: formData.password,
					name: formData.name || ''
				}
				response = await authService.register(registerData)
			}

			if (response.success) {
				setMessage(response.message)
				
				// Close modal or redirect after successful login
				setTimeout(() => {
					window.location.reload() // Simple reload for demo
				}, 1500)
			} else {
				setMessage(response.error || 'Có lỗi xảy ra')
			}
		} catch (error) {
			setMessage('Không thể kết nối đến server. Vui lòng thử lại sau.')
		} finally {
			setIsLoading(false)
		}
	}

	const toggleMode = () => {
		setIsLoginMode(!isLoginMode)
		setErrors({})
		setMessage('')
	}

	return (
		<div className="login-section">
			<div className="login-header">
				<h2 className="section-title">
					{isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
				</h2>
			</div>
			
			<p className="login-description">
				{isLoginMode 
					? 'Đăng nhập để truy cập tất cả tính năng'
					: 'Tạo tài khoản mới để bắt đầu'
				}
			</p>

			{/* Login/Register Form */}
			<form onSubmit={handleSubmit} className="auth-form">
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className={errors.email ? 'error' : ''}
						placeholder="Nhập email của bạn"
						disabled={isLoading}
					/>
					{errors.email && <span className="error-message">{errors.email}</span>}
				</div>

				<div className="form-group">
					<label htmlFor="password">Mật khẩu</label>
					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						className={errors.password ? 'error' : ''}
						placeholder="Nhập mật khẩu"
						disabled={isLoading}
					/>
					{errors.password && <span className="error-message">{errors.password}</span>}
				</div>

				{!isLoginMode && (
					<div className="form-group">
						<label htmlFor="name">Họ tên</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name || ''}
							onChange={handleInputChange}
							className={errors.name ? 'error' : ''}
							placeholder="Nhập họ tên của bạn"
							disabled={isLoading}
						/>
						{errors.name && <span className="error-message">{errors.name}</span>}
					</div>
				)}

				{message && (
					<div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
						{message}
					</div>
				)}

				<button 
					type="submit" 
					className="submit-btn"
					disabled={isLoading}
				>
					{isLoading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng nhập' : 'Đăng ký')}
				</button>
			</form>

			<div className="toggle-mode">
				<p>
					{isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
					<button 
						type="button" 
						onClick={toggleMode}
						className="toggle-btn"
					>
						{isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
					</button>
				</p>
			</div>
			
			<BenefitsList />
			<SocialLoginButtons />
			<LegalDisclaimer />
		</div>
	)
}

export default LoginSection
