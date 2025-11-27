import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
    plugins: [react()],
    base: '/FBD_KR4/' // добавляем эту строку
})
