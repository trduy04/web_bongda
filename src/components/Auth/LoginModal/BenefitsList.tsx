import React from 'react'
import './BenefitsList.scss'

function BenefitsList() {
	const benefits = [
		{ icon: '⭐', text: 'Lưu lại các đội yêu thích của bạn' },
		{ icon: '🏟️', text: 'Lưu lại các trận đấu yêu thích của bạn' },
		{ icon: '💻', text: 'Có các mục yêu thích của bạn trên mọi thiết bị' }
	]

	return (
		<div className="benefits">
			{benefits.map((benefit, index) => (
				<div key={index} className="benefit-item">
					<span className="benefit-icon">{benefit.icon}</span>
					<span>{benefit.text}</span>
				</div>
			))}
		</div>
	)
}

export default BenefitsList
