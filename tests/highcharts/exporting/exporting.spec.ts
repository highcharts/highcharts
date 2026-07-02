import { test, expect, createChart } from '~/fixtures.ts';
import type { Page } from '@playwright/test';

declare global {
    interface Window {
        testFontFetchUrls?: string[];
    }
}

const css = `
  @font-face {
    font-family: 'Oswald';
    src: url('/fonts/oswald.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Merriweather';
    src: url('/fonts/merriweather.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Fira Sans';
    src: url('/fonts/fira-sans.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Playfair Display';
    src: url('/fonts/playfair-display.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Cormorant Garamond';
    src: url('/fonts/cormorant-garamond.woff2') format('woff2');
  }

  /* Fonts used on the page but NOT by the chart */
  .heading-4 { font-family: 'Playfair Display', serif; }
  .heading-5 { font-family: 'Cormorant Garamond', serif; }

  /* Fonts used by the chart via CSS */
  .highcharts-subtitle,
  .highcharts-subtitle tspan {
    font-family: 'Merriweather', serif;
  }
  .highcharts-caption,
  .highcharts-caption tspan {
    font-family: 'Fira Sans', sans-serif;
  }
`;

async function appendPageOnlyFontUsage(page: Page) {
    await page.evaluate((chartCss) => {
        const style = document.createElement('style');
        style.textContent = chartCss;
        document.head.appendChild(style);

        const h4 = document.createElement('h4');
        h4.className = 'heading-4';
        h4.textContent = 'FONT 4 text';
        document.body.appendChild(h4);

        const h5 = document.createElement('h5');
        h5.className = 'heading-5';
        h5.textContent = 'FONT 5 text';
        document.body.appendChild(h5);
    }, css);
}

async function interceptFontFetches(page: Page) {
    await page.evaluate(() => {
        const w = window;
        w.testFontFetchUrls = [];

        window.fetch = (input: RequestInfo | URL) => {
            const url = String(typeof input === 'string' ?
                input :
                (input instanceof URL ? input.href : input.url));

            if (url.indexOf('/fonts/') > -1 && url.indexOf('.woff2') > -1) {
                w.testFontFetchUrls?.push(url);
                const buf = new Uint8Array([0, 1, 2, 3]).buffer;
                return Promise.resolve(new Response(buf, {
                    status: 200,
                    headers: {
                        'Content-Type': 'font/woff2'
                    }
                }));
            }

            return Promise.resolve(new Response('', { status: 404 }));
        };
    });
}

async function runInlineFontsScenario(
    page: Page,
    styledMode: boolean,
    exportType: 'image/png' | 'image/jpeg'
): Promise<string[]> {
    const chart = await createChart(
        page,
        {
            chart: {
                styledMode
            },
            title: {
                text: 'Custom chart title',
                style: {
                    fontFamily: 'Oswald'
                }
            },
            subtitle: {
                text: 'Custom chart subtitle'
            },
            caption: {
                text: 'Custom chart caption'
            },
            series: [{
                type: 'scatter',
                data: [
                    [1, 1],
                    [2, 1]
                ]
            }]
        },
        {
            modules: [
                'modules/exporting.js'
            ],
            applyTestOptions: false
        }
    );

    await appendPageOnlyFontUsage(page);
    await interceptFontFetches(page);

    await chart.evaluate(async (c, type) => {
        await c.exporting.exportChart({
            type
        });
    }, exportType);

    const fetchedFontUrls = await page.evaluate(
        () => window.testFontFetchUrls || []
    );

    return fetchedFontUrls;
}

test.describe('exporting/inline-fonts', () => {
    test('inlineFonts should only fetch fonts used by the chart', async ({ page }) => {
        test.setTimeout(15000);
        const fetchedFontUrls = await runInlineFontsScenario(
            page,
            false,
            'image/png'
        );

        expect(
            fetchedFontUrls.length,
            'Only fonts used by chart text should be fetched'
        ).toBe(3);

        expect(
            fetchedFontUrls.sort(),
            'Fetched fonts should match chart font usage'
        ).toEqual([
            '/fonts/fira-sans.woff2',
            '/fonts/merriweather.woff2',
            '/fonts/oswald.woff2'
        ]);
    });

    test('inlineFonts in styled mode should only fetch CSS fonts used by the chart', async ({ page }) => {
        test.setTimeout(15000);
        const fetchedFontUrls = await runInlineFontsScenario(
            page,
            true,
            'image/jpeg'
        );

        expect(
            fetchedFontUrls.length,
            'Styled mode should fetch only CSS fonts used by chart text'
        ).toBe(2);

        expect(
            fetchedFontUrls.sort(),
            'Styled mode should not fetch JS-config-only font family'
        ).toEqual([
            '/fonts/fira-sans.woff2',
            '/fonts/merriweather.woff2'
        ]);
    });
});
