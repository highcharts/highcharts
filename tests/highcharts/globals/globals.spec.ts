import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/Core/Globals.test.js
// The original test is for AMD loading of Highcharts package. This is a Playwright equivalent
// that verifies Highcharts loads correctly via script tag.

/**
 * Loads Highcharts behind a wrapped `EventTarget.addEventListener` that
 * records the options a `touchstart` listener was registered with. When
 * `copyOptions` is set, the wrapper forwards a shallow copy instead of the
 * original object, the way zone.js >= 0.14.7 does (#25092).
 */
async function loadWithListenerSpy(page: Page, copyOptions: boolean) {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script>
                    const nativeAdd = EventTarget.prototype.addEventListener;

                    EventTarget.prototype.addEventListener = function (
                        type,
                        listener,
                        options
                    ) {
                        const forwarded = ${copyOptions} &&
                            typeof options === 'object' && options !== null ?
                            { ...options } : options;

                        if (type === 'touchstart') {
                            window.touchstartOptions = forwarded;
                        }

                        return nativeAdd.call(this, type, listener, forwarded);
                    };
                </script>
                <script src="https://code.highcharts.com/highcharts.src.js"></script>
            </head>
            <body></body>
        </html>
    `, { waitUntil: 'networkidle' });

    return page.evaluate(() => {
        const testWindow = window as any,
            Highcharts = testWindow.Highcharts,
            removeEvent = Highcharts.addEvent(
                document.createElement('div'),
                'touchstart',
                (): void => {}
            );

        try {
            return {
                supportsPassiveEvents: Highcharts.supportsPassiveEvents,
                passive: testWindow.touchstartOptions?.passive
            };
        } finally {
            removeEvent();
        }
    });
}

test.describe('Globals', () => {
    test('Highcharts object is available via script tag', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                </head>
                <body>
                    <div id="container"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(() => {
            const Highcharts = (window as any).Highcharts;
            return {
                isObject: typeof Highcharts === 'object' && Highcharts !== null,
                hasChartMethod: typeof Highcharts?.chart === 'function',
                hasProduct: typeof Highcharts?.product === 'string'
            };
        });

        expect(result.isObject, 'Highcharts should be an object').toBe(true);
        expect(result.hasChartMethod, 'Highcharts should have chart method').toBe(true);
        expect(result.hasProduct, 'Highcharts should have product property').toBe(true);
    });

    test('Passive events are detected', async ({ page }) => {
        const result = await loadWithListenerSpy(page, false);

        expect(result.supportsPassiveEvents).toBe(true);
        expect(result.passive).toBe(true);
    });

    test('Passive events are detected through copied options', async ({
        page
    }) => {
        const result = await loadWithListenerSpy(page, true);

        expect(result.supportsPassiveEvents).toBe(true);
        expect(result.passive).toBe(true);
    });
});
