import React from 'react'
import './LoginSection.scss'
import BenefitsList from './BenefitsList'
import SocialLoginButtons from './SocialLoginButtons'
import LegalDisclaimer from './LegalDisclaimer'

function LoginSection() {
	return (
		<div className="login-section">
			<div className="login-header">
				<h2 className="section-title">Mở khóa tất cả trải nghiệm</h2>
			</div>
			
			<p className="login-description">
				Nhanh chóng, miễn phí và đầy đủ đặc quyền. Đăng ký trong vài giây!
			</p>
			
			<BenefitsList />
			<SocialLoginButtons />
			<LegalDisclaimer />
		</div>
	)
}

export default LoginSection
