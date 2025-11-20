// spec: tests/highcharts/mobile-interactions-test-plan.md
// seed: tests/highcharts/seed.spec.ts

import { test, expect } from '../fixtures';
import { getSample, template } from '../utils';


// TODO: WaitForResize utility function
// * Maybe afterAnimate
// * isResizing flag
// * endResize event
// * ResizeObserver



test.describe('Responsive Chart Behavior', () => {

    test.beforeEach(async ({ page }) => {
        // Load the responsive chart sample
        const sample = getSample(
            'samples/highcharts/responsive/axis'
        );
        await page.setContent(template(sample));
        await page.waitForFunction(
            () => window.Highcharts && window.Highcharts.charts[0]
        );
    });

    test('4.1 Responsive Chart on Small Viewport (Portrait Phone)', async ({ page }) => {
        // Set viewport to iPhone SE size (375x667)
        await page.setViewportSize({ width: 375, height: 667 });

        // 1. Load responsive chart demo on small phone viewport (done in beforeEach)

        // 2. Verify the chart container is visible
        const container = page.locator('#container');
        await expect(container).toBeVisible();

        // 3. Check that x-axis labels are abbreviated (single letter format: J, F, M, A)
        // Use expect.poll to wait for responsive rules to apply
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('J');

        // 4. Verify y-axis title is hidden (empty text)
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('');

        // 5. Confirm chart renders within viewport without horizontal overflow
        const chartWidth = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return chart.chartWidth;
        });
        expect(chartWidth).toBeLessThanOrEqual(375);
    });

    test('4.2 Responsive Chart on Medium Viewport (Phablet/Small Tablet)', async ({ page }) => {
        // Set viewport to medium size (600x800)
        await page.setViewportSize({ width: 600, height: 800 });

        // 1. Load responsive chart on medium viewport device (done in beforeEach)

        // 2. Verify the chart container is visible
        const container = page.locator('#container');
        await expect(container).toBeVisible();

        // 3. Check that x-axis labels show full month names
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        // 4. Verify y-axis title is visible with text "Items"
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');

        // 5. Confirm chart layout is optimized for medium screen
        const chartWidth = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return chart.chartWidth;
        });
        expect(chartWidth).toBeGreaterThan(500);
    });

    test('4.3 Responsive Chart on Tablet (Landscape)', async ({ page }) => {
        // Set viewport to iPad Air landscape (1180x820)
        await page.setViewportSize({ width: 1180, height: 820 });

        // 1. Load responsive chart on tablet in landscape orientation (done in beforeEach)

        // 2. Verify the chart container is visible
        const container = page.locator('#container');
        await expect(container).toBeVisible();

        // 3. Check that all month names are displayed in full
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        const lastMonthLabel = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            const lastIndex = chart.xAxis[0].categories.length - 1;
            return (chart.xAxis[0].ticks[lastIndex]?.label)?.textStr || '';
        });
        expect(lastMonthLabel).toBe('December');

        // 4. Verify y-axis title "Items" is fully displayed
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');

        // 5. Confirm chart takes advantage of large viewport
        const chartWidth = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return chart.chartWidth;
        });
        // Chart should be at least 700px on large viewport (not constrained to 500px mobile breakpoint)
        expect(chartWidth).toBeGreaterThan(700);
    });

    test('4.4 Device Rotation: Portrait to Landscape', async ({ page }) => {
        // 1. Load responsive chart on phone in portrait mode (393x852)
        await page.setViewportSize({ width: 393, height: 852 });

        // 2. Verify x-axis labels are abbreviated in narrow portrait mode (393px < 500px)
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('J');

        // 3. Change viewport to landscape orientation (852x393)
        await page.setViewportSize({ width: 852, height: 393 });

        // 4. Verify chart reflows and x-axis labels show full names (852px > 500px, responsive rule doesn't apply)
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        // 5. Change viewport back to portrait (393x852)
        await page.setViewportSize({ width: 393, height: 852 });

        // 6. Verify chart returns to abbreviated labels (393px < 500px)
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('J');
    });

    test('4.5 Dynamic Viewport Resize', async ({ page }) => {
        // 1. Load responsive chart with viewport 1200x800
        await page.setViewportSize({ width: 1200, height: 800 });

        // 2. Verify x-axis shows full month names at 1200px width
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');

        // 3-4. Resize viewport to 800x600
        await page.setViewportSize({ width: 800, height: 600 });

        // Verify chart still shows full month names (width > 500)
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');

        // 5-6. Resize viewport to 450x600
        await page.setViewportSize({ width: 450, height: 600 });

        // Verify x-axis labels are abbreviated to single letters
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('J');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe(''); // Y-axis title should be hidden

        // 7-8. Resize viewport back to 1200x800
        await page.setViewportSize({ width: 1200, height: 800 });

        // Verify chart returns to full month names
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');
    });

    test('4.6 Programmatic Resize with setSize()', async ({ page }) => {
        // Set initial viewport
        await page.setViewportSize({ width: 1200, height: 800 });

        // 1. Load responsive chart with size control buttons (done in beforeEach)

        // 2. Click "Small" button to resize to 400x300
        await page.click('#small');

        // 3. Verify chart width is 400px
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return chart.chartWidth;
            });
        }).toBe(400);

        // 4. Verify x-axis labels are abbreviated to single letters
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('J');

        // 5. Verify y-axis title is hidden
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('');

        // 6. Click "Large" button to resize to 800x300
        await page.click('#large');

        // 7. Verify chart width is 800px
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return chart.chartWidth;
            });
        }).toBe(800);

        // 8. Verify x-axis labels show full month names
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.xAxis[0].ticks[0]?.label)?.textStr || '';
            });
        }).toBe('January');

        // 9. Verify y-axis title shows "Items"
        await expect.poll(async () => {
            return await page.evaluate(() => {
                const chart = (window as any).Highcharts.charts[0];
                return (chart.yAxis[0]).axisTitle?.textStr || '';
            });
        }).toBe('Items');
    });
});
