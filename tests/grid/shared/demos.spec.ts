import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { globSync } from 'glob';
import { test, expect } from '~/fixtures.ts';

const rootDir = join(__dirname, '..', '..', '..');

const expectedStyles = {
    body: /body\s*\{[^}]*font-family:\s*-apple-system,\s*BlinkMacSystemFont,\s*"Segoe UI",\s*Roboto,\s*Helvetica,\s*Arial,\s*"Apple Color Emoji",\s*"Segoe UI Emoji",\s*"Segoe UI Symbol",\s*sans-serif[^}]*background:\s*var\(--highcharts-background-color\)[^}]*color:\s*var\(--highcharts-neutral-color-100\)/,
    '.demo': /\.demo[^{]*\{[^}]*padding:\s*8px\s+12px\s*[;}]/,
    '.highcharts-description': /\.highcharts-description[^{]*\{[^}]*padding:\s*0\s+8px\s*[;}]/
};

// Samples that need resources the test routes cannot serve locally
const excludedDemos: Record<string, string> = {
    'grid-lite/basic/data-connector':
        'Loads a CSV from demo-live-data that is not in samples/data',
    'grid-lite/studies/columns-virtualization-benchmark':
        'Loads CSS from the /code/ path of the utils server',
    'grid-lite/studies/grid-virtual-scroll-benchmark':
        'Loads CSS from the /code/ path of the utils server',
    'grid-pro/demo/fixed-income-sectors-tree':
        'Loads data from the Morningstar API',
    'grid-pro/demo/formulas': 'Needs the Dashboards build',
    'grid-pro/demo/validation': 'Needs the Dashboards build'
};

for (const product of ['grid-lite', 'grid-pro']) {
    const demoPaths = globSync('**/demo.html', {
        cwd: join(rootDir, 'samples', product),
        posix: true
    }).map(file => file.replace(/\/demo\.html$/, '')).sort();

    test.describe(`${product} demos`, () => {
        for (const demoPath of demoPaths) {
            const skipReason = excludedDemos[`${product}/${demoPath}`];

            test(`should not have console errors in ${demoPath}`, async ({ page }) => {
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
                    errors.push(
                        `${request.failure()?.errorText}: ${request.url()}`
                    );
                });
                page.on('response', response => {
                    if (response.status() >= 400) {
                        errors.push(`${response.status()}: ${response.url()}`);
                    }
                });

                // The option controls of some samples are not under test
                await page.route(
                    '**/cdn.jsdelivr.net/npm/@highcharts/controls@*',
                    route => route.fulfill({
                        contentType: 'application/javascript',
                        body: ''
                    })
                );

                await page.goto(`/${product}/${demoPath}`, {
                    waitUntil: 'networkidle'
                });

                expect(
                    errors.filter(msg => !msg.includes('ResizeObserver')),
                    `Console errors in ${demoPath}`
                ).toEqual([]);
            });

            // Only validate styles for the samples under the demo directory.
            if (demoPath.startsWith('demo/')) {
                test(`should contain shared demo styles in ${demoPath}`, () => {
                    const css = readFileSync(
                        join(rootDir, 'samples', product, demoPath, 'demo.css'),
                        'utf8'
                    );

                    for (
                        const [name, regex] of Object.entries(expectedStyles)
                    ) {
                        expect.soft(css, `Proper ${name} styles`)
                            .toMatch(regex);
                    }
                });
            }
        }
    });
}
