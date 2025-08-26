import React from 'react'
import './SocialLoginButtons.scss'

function SocialLoginButtons() {
	const socialButtons = [
		{ type: 'google', icon: 'G', text: 'Tiếp tục với Google' },
		{ type: 'apple', icon: '🍎', text: 'Tiếp tục với Apple' },
		{ type: 'facebook', icon: 'f', text: 'Tiếp tục với Facebook' },
		{ type: 'email', icon: '✉️', text: 'Tiếp tục với email' }
	]

	return (
		<div className="login-buttons">
			{socialButtons.map((button, index) => (
				<button key={index} className={`social-login-btn ${button.type}-btn`}>
					<span className="social-icon">{button.icon}</span>
					{button.text}
				</button>
			))}
		</div>
	)
}

export default SocialLoginButtons
