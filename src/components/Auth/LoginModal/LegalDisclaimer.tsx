import React from 'react'
import './LegalDisclaimer.scss'

function LegalDisclaimer() {
	return (
		<div className="legal-disclaimer">
			Qua việc nhấp vào bất kỳ nút "tiếp tục" nào, bạn đã đồng ý với{' '}
			<a href="#" className="legal-link">điều khoản sử dụng</a> và xác nhận{' '}
			<a href="#" className="legal-link">chính sách bảo mật</a> của chúng tôi trên trang web.
		</div>
	)
}

export default LegalDisclaimer
