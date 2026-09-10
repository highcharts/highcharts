import { test, expect } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/Core/Globals.test.js
// The original test is for AMD loading of Highcharts package. This is a Playwright equivalent
// that verifies Highcharts loads correctly via script tag.

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

    test('Passive events are detected through copied options', async ({
        page
    }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script>
                        const nativeAddEventListener =
                            EventTarget.prototype.addEventListener;

                        EventTarget.prototype.addEventListener = function (
                            type,
                            listener,
                            options
                        ) {
                            const copiedOptions =
                                typeof options === 'object' && options !== null ?
                                    { ...options } : options;

                            if (type === 'touchstart') {
                                window.touchstartOptions = copiedOptions;
                            }

                            return nativeAddEventListener.call(
                                this,
                                type,
                                listener,
                                copiedOptions
                            );
                        };

                        window.restoreAddEventListener = function () {
                            EventTarget.prototype.addEventListener =
                                nativeAddEventListener;
                        };
                    </script>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        try {
            const result = await page.evaluate(() => {
                const testWindow = window as any,
                    Highcharts = testWindow.Highcharts,
                    element = document.createElement('div'),
                    removeEvent = Highcharts.addEvent(
                        element,
                        'touchstart',
                        (): void => {}
                    );

                try {
                    return {
                        supportsPassiveEvents:
                            Highcharts.supportsPassiveEvents,
                        passive: testWindow.touchstartOptions?.passive
                    };
                } finally {
                    removeEvent();
                }
            });

            expect(result.supportsPassiveEvents).toBe(true);
            expect(result.passive).toBe(true);
        } finally {
            await page.evaluate(() => {
                (window as any).restoreAddEventListener();
            });
        }
    });
});
