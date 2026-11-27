import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    testMatch: 'consumer.spec.mjs',
    reporter: [['list'], ['json', { outputFile: 'browser-results.json' }]],
    use: { trace: 'retain-on-failure' }
});
