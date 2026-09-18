import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

test.describe('Fullscreen', () => {
    test(
        'should preserve bottom scroll after fullscreen + tab focus (#18417)',
        async ({ page, browserName }) => {
            // Browser-specific regression: keep this scoped to Chromium.
            // eslint-disable-next-line playwright/no-skipped-test
            test.skip(browserName !== 'chromium');

            await page.setViewportSize({
                width: 1280,
                height: 400
            });

            const reproHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <style>
                        .lorem {
                            height: 2000px;
                            display: block;
                        }
                        #container {
                            height: 300px;
                            position: relative;
                        }
                        #container-placeholder {
                            height: 300px;
                            position: relative;
                        }
                        #test {
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 1000;
                        }
                    </style>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/exporting.src.js"></script>
                </head>
                <body>
                    <p class="lorem">
                        Lorem ipsum dolor sit amet.
                    </p>
                    <div id="container-placeholder">
                        <div id="container"></div>
                    </div>
                    <script>
                        window.chart = Highcharts.chart('container', {
                            credits: {
                                enabled: false
                            },
                            xAxis: {
                                categories: [
                                    'Jan', 'Feb', 'Mar', 'Apr', 'May',
                                    'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
                                    'Nov', 'Dec'
                                ]
                            },
                            series: [{
                                data: [
                                    29.9, 71.5, 106.4, 129.2, 144.0,
                                    176.0, 135.6, 148.5, 216.4, 194.1,
                                    95.6, 54.4
                                ]
                            }]
                        });

                        const btn = document.createElement('button');
                        btn.innerText = 'Button';
                        btn.id = 'test';
                        document.getElementById('container').appendChild(btn);
                    </script>
                </body>
            </html>`;

            await page.route('**/fullscreen-scroll-repro.html', async route => {
                await route.fulfill({
                    contentType: 'text/html',
                    body: reproHtml
                });
            });
            await page.goto('http://localhost/fullscreen-scroll-repro.html');

            await page.waitForFunction(() => (
                !!window['chart'] && !!document.getElementById('test')
            ));

            const before = await getScrollState(page);
            await page.evaluate(() => {
                const maxY = Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight
                ) - window.innerHeight;

                window.scrollTo(0, maxY);
            });
            const initial = await getScrollState(page);

            await clickExportMenuItem(page, /View.*full screen/i);
            await page.waitForFunction(() => !!document.fullscreenElement);

            await page.keyboard.press('Tab');
            await page.waitForFunction(() => document.activeElement?.id === 'test');

            await clickExportMenuItem(page, /Exit.*full screen/i);
            await page.waitForFunction(() => !document.fullscreenElement);
            await waitForAnimationFrames(page, 4);

            const final = await getScrollState(page);

            expect(
                before.y < initial.y,
                `Precondition failed: expected initial scroll to be below ${
                    before.y
                }, got ${initial.y}`
            ).toBeTruthy();

            expect(
                final.bottomOffset,
                `Expected to stay at bottom after close, got ${
                    JSON.stringify({ initial, final })
                }`
            ).toBeLessThanOrEqual(1);

            expect(
                Math.abs(final.y - initial.y),
                `Expected y to be restored, got ${
                    JSON.stringify({ initial, final })
                }`
            ).toBeLessThanOrEqual(2);
        }
    );
});

async function getScrollState(page: Page): Promise<{
    y: number;
    maxY: number;
    bottomOffset: number;
}> {
    return page.evaluate(() => {
        const maxY = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) - window.innerHeight;
        const y = Math.round(window.scrollY);
        const maxYRounded = Math.round(maxY);

        return {
            y,
            maxY: maxYRounded,
            bottomOffset: maxYRounded - y
        };
    });
}

async function waitForAnimationFrames(
    page: Page,
    frames: number
): Promise<void> {
    await page.evaluate((framesArg: number): Promise<void> => (
        new Promise<void>((resolve): void => {
            let left = framesArg;

            const step = (): void => {
                left -= 1;
                if (left <= 0) {
                    resolve();
                    return;
                }
                requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        })
    ), frames);
}

async function clickExportMenuItem(page: Page, label: RegExp): Promise<void> {
    await page.locator('.highcharts-contextbutton').click();

    const menuItem = page
        .locator('li.highcharts-menu-item:visible')
        .filter({ hasText: label })
        .first();

    await expect(menuItem).toBeVisible();
    await menuItem.click();
}
