import { defineConfig, devices } from '@playwright/test';
const siteBase=(process.env.SITE_BASE??'').replace(/^\/+|\/+$/g,'');
const baseURL=`http://127.0.0.1:4321/${siteBase?`${siteBase}/`:''}`;
export default defineConfig({
  testDir:'./tests/e2e',
  fullyParallel:true,
  reporter:'list',
  use:{baseURL,trace:'retain-on-failure',...devices['Desktop Chrome']},
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4321 --strictPort',url:baseURL,reuseExistingServer:!process.env.CI,timeout:30_000},
});
