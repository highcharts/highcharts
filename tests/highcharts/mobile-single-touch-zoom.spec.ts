// spec: tests/highcharts/mobile-interactions-test-plan.md
// seed: tests/highcharts/seed.spec.ts

import { test, expect } from '../fixtures';
import { getSample, template } from '../utils';
import { performTouchDrag, getChartPlotArea } from '../touch-utils';

// Disable specific eslint rules for this test file
/* eslint-disable playwright/no-wait-for-timeout */

test.describe('Single Touch Zoom - Enable/Disable', () => {
    // Configure mobile device emulation for all tests
    test.use({
        viewport: { width: 375, height: 667 }, // iPhone SE
        hasTouch: true,
    });

    test.beforeEach(async ({ page }) => {
        // Load the single touch zoom sample
        const sample = getSample(
            'samples/highcharts/chart/zoombysingletouch'
        );
        await page.setContent(template(sample));
        await page.waitForFunction(
            () => window.Highcharts && window.Highcharts.charts[0]
        );
    });

    test('1.1 Single Touch Zoom Enabled', async ({ page }) => {
        // 1. Load the single touch zoom demo page on mobile device
        // (already loaded in beforeEach)

        // 2. Verify the "True" button is active/highlighted
        const trueButton = page.locator('button[data-singletouchzoom="true"]');
        await expect(trueButton).toHaveClass(/active/);

        // 3-5. Place one finger on the chart plot area and drag
        const plotArea = await getChartPlotArea(page);

        // Perform touch drag gesture from left to right (Jan to Jun)
        await performTouchDrag(
            page,
            plotArea.left,
            plotArea.centerY,
            plotArea.right,
            plotArea.centerY
        );

        await page.waitForTimeout(500); // Wait for zoom animation

        // Expected Results: Chart zooms into the selected range
        const zoomState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                xMin: chart.xAxis[0].min,
                xMax: chart.xAxis[0].max,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });

        // Verify chart is zoomed (not showing all 12 categories)
        expect(zoomState.xMax - zoomState.xMin).toBeLessThan(11);
        expect(zoomState.hasResetZoomButton).toBe(true);
    });

    test('1.2 Single Touch Zoom Disabled', async ({ page }) => {
        // 1. Tap the "False" button to disable single touch zoom
        const falseButton = page.locator('button[data-singletouchzoom="false"]');
        await falseButton.click({ force: true });

        // 2. Verify the "False" button becomes active/highlighted
        await expect(falseButton).toHaveClass(/active/);

        // 3-5. Place one finger on chart plot area and drag
        const plotArea = await getChartPlotArea(page);

        // Perform touch drag gesture
        await performTouchDrag(
            page,
            plotArea.left,
            plotArea.centerY,
            plotArea.right,
            plotArea.centerY
        );

        await page.waitForTimeout(500);

        // Expected Results: No zoom selection occurs
        const zoomState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                xMin: chart.xAxis[0].min,
                xMax: chart.xAxis[0].max,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });

        // Verify chart is NOT zoomed (showing all 12 categories)
        expect(zoomState.xMin).toBe(0);
        expect(zoomState.xMax).toBe(11);
        expect(zoomState.hasResetZoomButton).toBe(false);
    });

    test('1.3 Reset Zoom After Single Touch', async ({ page }) => {
        // First, zoom into the chart
        const plotArea = await getChartPlotArea(page);

        // Perform zoom gesture
        await performTouchDrag(
            page,
            plotArea.left,
            plotArea.centerY,
            plotArea.right,
            plotArea.centerY
        );

        await page.waitForTimeout(500);

        // Verify chart is zoomed
        let zoomState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                xMin: chart.xAxis[0].min,
                xMax: chart.xAxis[0].max,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });
        expect(zoomState.hasResetZoomButton).toBe(true);

        // 1-2. Locate and click the "Reset zoom" button
        const resetButton = page.locator('.highcharts-reset-zoom');
        await expect(resetButton).toBeVisible();
        await resetButton.click({ force: true });

        // 3. Observe the chart animation
        await page.waitForTimeout(300);

        // Expected Results: Chart animates back to default view
        zoomState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                xMin: chart.xAxis[0].min,
                xMax: chart.xAxis[0].max,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });

        expect(zoomState.xMin).toBe(0);
        expect(zoomState.xMax).toBe(11);
        expect(zoomState.hasResetZoomButton).toBe(false);
    });

    test('1.4 Toggle Single Touch Multiple Times', async ({ page }) => {
        const trueButton = page.locator('button[data-singletouchzoom="true"]');
        const falseButton = page.locator('button[data-singletouchzoom="false"]');

        const performZoomGesture = async () => {
            const plotArea = await getChartPlotArea(page);
            await performTouchDrag(
                page,
                plotArea.left,
                plotArea.centerY,
                plotArea.right,
                plotArea.centerY
            );
            await page.waitForTimeout(500);
        };

        // 1. Tap "True" button to enable single touch zoom (already enabled by default)
        await expect(trueButton).toHaveClass(/active/);

        // 2. Perform a zoom gesture
        await performZoomGesture();

        // 3. Verify zoom occurs
        const zoomState = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                isZoomed: chart.xAxis[0].max - chart.xAxis[0].min < 11,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });
        expect(zoomState.isZoomed).toBe(true);
        expect(zoomState.hasResetZoomButton).toBe(true);

        // 4. Click "Reset zoom" button
        const resetButton = page.locator('.highcharts-reset-zoom');
        await resetButton.click({ force: true });
        await page.waitForTimeout(300);

        // 5. Click "False" button to disable single touch zoom
        await falseButton.click({ force: true });
        await expect(falseButton).toHaveClass(/active/);

        // 6-7. Attempt zoom gesture - verify no zoom occurs
        await performZoomGesture();
        const zoomState2 = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                xMin: chart.xAxis[0].min,
                xMax: chart.xAxis[0].max,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });
        expect(zoomState2.xMin).toBe(0);
        expect(zoomState2.xMax).toBe(11);
        expect(zoomState2.hasResetZoomButton).toBe(false);

        // 8. Click "True" button again
        await trueButton.click({ force: true });
        await expect(trueButton).toHaveClass(/active/);

        // 9. Perform another zoom gesture
        await performZoomGesture();
        const zoomState3 = await page.evaluate(() => {
            const chart = (window as any).Highcharts.charts[0];
            return {
                isZoomed: chart.xAxis[0].max - chart.xAxis[0].min < 11,
                hasResetZoomButton: !!chart.resetZoomButton
            };
        });

        // Expected Results: Each zoom gesture after re-enabling works
        expect(zoomState3.isZoomed).toBe(true);
        expect(zoomState3.hasResetZoomButton).toBe(true);
    });
});
