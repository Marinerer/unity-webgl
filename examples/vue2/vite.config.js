import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
	plugins: [vue(), legacy()],
	server: {
		port: 3020,
	},
})
