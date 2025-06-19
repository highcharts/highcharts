import { defineConfig } from '@playwright/test';

const testPort = process.env.TEST_PORT ?? 3131;

export default defineConfig({
    testDir: './tests/pw/',
    timeout: 10000,
    use: {
        baseURL: `http://localhost:${testPort}`,
        headless: true,
        viewport: { width: 800, height: 600 },
    },
    webServer: {
        command: `npx serve -p ${testPort} ./tests/html/`,
        port: testPort,
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'pipe',
    }
});
