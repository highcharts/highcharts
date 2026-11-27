import { expect, test as base } from '@playwright/test';
import { preview } from 'vite';
import { browserCases, consumerStartedAttachment } from './browser-cases.mjs';

const test = base.extend({
    origin: [async ({}, use) => {
        const server = await preview({ preview: { host: '127.0.0.1', port: 0 } });
        try {
            await use(`http://127.0.0.1:${server.httpServer.address().port}`);
        } finally {
            await server.close();
        }
    }, { scope: 'worker' }],
    consumerPage: async ({ origin, page }, use) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error') {
                errors.push(message.text());
            }
        });
        await use({ page, origin });
        expect(errors).toEqual([]);
    }
});

for (const { id, page: entry, prepare, check } of browserCases) {
    test(id, async ({ consumerPage: { page, origin } }, testInfo) => {
        await prepare?.(page);
        await testInfo.attach(consumerStartedAttachment, { body: 'true' });
        await page.goto(new URL(entry, origin).href);
        await check(page, expect);
    });
}
