import { defineConfig, ProxyOptions, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const API_KEY = env.VITE_FD_API_KEY || '89768fc5050a4566aa024822e20b72d3'
	
	return {
		plugins: [react()],
		server: {
			proxy: {
				'/api/football': {
					target: 'https://api.football-data.org',
					changeOrigin: true,
					secure: true,
					rewrite: (path) => path.replace(/^\/api\/football/, ''),
					configure: (proxy) => {
						proxy.on('proxyReq', (proxyReq) => {
							proxyReq.setHeader('X-Auth-Token', API_KEY)
						})
					},
				} as ProxyOptions,
			},
		},
	}
})
