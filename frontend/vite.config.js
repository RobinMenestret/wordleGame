import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_CLIENT_GOOGLE': JSON.stringify(env.REACT_APP_CLIENT_GOOGLE),
      'process.env.REACT_APP_REDIRECT_GOOGLE': JSON.stringify(env.REACT_APP_REDIRECT_GOOGLE),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    },
    plugins: [react()],
    base:'/',
  }
})