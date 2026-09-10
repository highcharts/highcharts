import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setupRoutes } from '../fixtures';

const sources = JSON.parse(readFileSync(
    join(__dirname, 'data/index.json'), 'utf8'
)) as { url: string; filename: string; postData?: unknown }[];
const portfolio = sources.find(source =>
    source.filename === 'correlation-matrix.json'
);

test('visual portfolio fixture requires the recorded method and body', async ({ page }) => {
    await page.context().setOffline(true);
    await setupRoutes(page);
    await page.goto('http://localhost/shim.html');

    const results = await page.evaluate(async source => {
        const request = async (method: string, postData?: unknown) => {
            try {
                const response = await fetch(source.url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: postData === undefined ?
                        undefined : JSON.stringify(postData)
                });
                return response.status;
            } catch {
                return 'rejected';
            }
        };
        return [
            await request('POST', source.postData),
            await request('POST', { portfolios: [] }),
            await request('GET')
        ];
    }, portfolio);

    expect(results).toEqual([200, 'rejected', 'rejected']);
});
