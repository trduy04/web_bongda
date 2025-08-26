import React from 'react'
import './LoginModal.scss'
import AppDownloadSection from './LoginModal/AppDownloadSection'
import LoginSection from './LoginModal/LoginSection'

interface LoginModalProps {
	isOpen: boolean
	onClose: () => void
}

function LoginModal({ isOpen, onClose }: LoginModalProps) {
	if (!isOpen) return null

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close" onClick={onClose}>
					✕
				</button>
				
				<div className="modal-body">
					<AppDownloadSection />
					<LoginSection />
				</div>
			</div>
		</div>
	)
}

export default LoginModal
