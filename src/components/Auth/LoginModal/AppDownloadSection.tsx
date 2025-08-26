import React from 'react'
import './AppDownloadSection.scss'

function AppDownloadSection() {
	return (
		<div className="app-download-section">
			<h2 className="section-title">Nhận Flashscore cho iOS hoặc Android</h2>
			<div className="phone-mockup">
				<div className="phone-screen">
					<div className="app-interface">
						<div className="app-header">FLASHSCORE</div>
						<div className="qr-code">
							<div className="qr-placeholder">
								<div className="qr-grid">
									{Array.from({ length: 25 }, (_, i) => (
										<div key={i} className={`qr-cell ${Math.random() > 0.3 ? 'filled' : ''}`}></div>
									))}
								</div>
							</div>
							<p className="qr-text">Quét để tải xuống</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AppDownloadSection
