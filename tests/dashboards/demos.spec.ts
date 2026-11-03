import { join } from 'node:path';
import { globSync } from 'glob';
import { test, expect } from '~/fixtures.ts';
import { testViewport } from '~/helpers.ts';

const excludedDemos: Record<string, string> = {
    'gui/layout': 'Excluded since the Cypress test',
    'components/component-error-handler': 'Shows component errors on purpose',
    'basic/google-spreadsheets': 'Excluded since the Cypress test',
    'demo/personal-portfolio': 'Excluded since the Cypress test',
    'data/googlesheets-tutorial':
        'The Google Sheets API key rejects the http://localhost referer'
};

const demoPaths = globSync('**/demo.html', {
    cwd: join(__dirname, '..', '..', 'samples', 'dashboards'),
    posix: true
}).map(file => file.replace(/\/demo\.html$/u, '')).sort();

test.use({ viewport: testViewport });

test.describe('Dashboards demos', () => {
    for (const demoPath of demoPaths) {
        const skipReason = excludedDemos[demoPath];

        test(`Should not have console errors in ${demoPath}`, async ({ page }) => {
            test.skip(!!skipReason, skipReason);

            const errors: string[] = [];

            page.on('console', msg => {
                // Failed requests are reported below, with their URLs
                if (
                    msg.type() === 'error' &&
                    !msg.text().startsWith('Failed to load resource')
                ) {
                    errors.push(msg.text());
                }
            });
            page.on('pageerror', error => {
                errors.push(error.message);
            });
            page.on('requestfailed', request => {
                const error = request.failure()?.errorText;

                // Requests the page cancels itself, e.g. by reloading a frame
                if (error !== 'net::ERR_ABORTED') {
                    errors.push(`${error}: ${request.url()}`);
                }
            });
            page.on('response', response => {
                if (response.status() >= 400) {
                    errors.push(`${response.status()}: ${response.url()}`);
                }
            });

            await page.goto(`/dashboards/${demoPath}`, {
                waitUntil: 'networkidle'
            });

            expect(errors, `Console errors in ${demoPath}`).toEqual([]);
        });
    }
});
