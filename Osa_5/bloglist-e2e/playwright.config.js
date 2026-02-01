import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 120000,
    reuseExistingServer: true,
    cwd: '../bloglist-frontend',
    env: {
      NODE_ENV: 'test',
      VITE_BACKEND_URL: 'http://localhost:3003',
      ComSpec: 'C:\\Windows\\System32\\cmd.exe'
    }
  }
});
