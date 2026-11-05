import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { useSharedPage, waitForChart } from '~/helpers.ts';
import {
    addIndicator,
    openIndicators,
    popupButton,
    selectIndicator
} from '../helpers.ts';

/**
 * Whether every indicator axis, except the first ones, starts where the
 * previous one ends.
 */
async function expectStackedAxes(page: Page): Promise<void> {
    await waitForChart(page);
    await expect.poll(() => page.evaluate(() => {
        // Exclude 2 first axes and navigator axis.
        const yAxis = Highcharts.charts[0].yAxis
            .filter(axis => !axis.options.isInternal);
        const gaps: number[] = [];

        for (let i = 3; i < yAxis.length - 1; i++) {
            gaps.push(Math.abs(
                yAxis[i].top + yAxis[i].height - yAxis[i + 1].top
            ));
        }
        return gaps.every(gap => gap <= 1);
    }), 'The end of each axis should be close to beginning of the next.')
        .toBe(true);
}

async function removeIndicator(page: Page, name: string): Promise<void> {
    await openIndicators(page);
    // Open EDIT bookmark.
    await page.locator('.highcharts-tab-item').nth(1).click();
    await selectIndicator(page, name);
    // Remove that indicator.
    await popupButton(page, 2).click();
}

test.describe('Adding custom indicator on a separate axis through indicator popup, #15804.', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/custom-indicator-stock-tools-gui',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('#15730: Should close popup after hiding annotation', async () => {
        const page = getPage();

        await openIndicators(page);
        await selectIndicator(page, 'CUSTOMINDICATORBASEDONRSI');
        await addIndicator(page);

        await waitForChart(page);
        await expect.poll(
            () => page.evaluate(() => Highcharts.charts[0].yAxis.length),
            'After adding a custom indicator that is based on other ' +
            'oscillators, another axis should be added.'
        ).toBe(4);
    });
});

test.describe('Axis height recalculation.', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Axes should scale after removing indicators through Stock Tools GUI, #15735.', async () => {
        const page = getPage();

        for (const period of [20, 25, 30, 35, 45]) {
            await openIndicators(page);
            await selectIndicator(page, 'ATR');
            await page.locator('input[name="highcharts-atr-period"]').first()
                .fill(String(period));
            await addIndicator(page);
        }

        await expectStackedAxes(page);
        await removeIndicator(page, 'ATR (35)');
        await expectStackedAxes(page);

        await page.evaluate(() => {
            const yAxis = Highcharts.charts[0].yAxis[0];
            yAxis.update({
                top: yAxis.top + 30,
                height: yAxis.height - 30
            });
        });
        await removeIndicator(page, 'ATR (30)');
        await expectStackedAxes(page);
    });
});

test.describe('An indicator on indicator, #15696.', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 800 })
    );

    test('There should be a possibility to add indicators based on other indicator, #15696.', async () => {
        const page = getPage();
        const option = (text: string) => page
            .locator('#highcharts-select-series option', { hasText: text })
            .first();

        await openIndicators(page);
        await selectIndicator(page, 'SMA');
        await addIndicator(page); // Add SMA indicator.

        await openIndicators(page);
        await selectIndicator(page, 'SMA');
        await expect(option('SMA (14)')).toBeAttached();

        await page.locator('#highcharts-select-series').first()
            .selectOption('SMA (14)');

        await page.locator('input[name="highcharts-sma-period"]').first()
            .fill('20');

        await addIndicator(page); // Add SMA indicator with period 20.

        await waitForChart(page);
        await expect.poll(
            () => page.evaluate(() => {
                const series = Highcharts.charts[0].series;
                return series[2].dataTable.rowCount -
                    series[3].dataTable.rowCount;
            }),
            'The second SMA indicator which is based on the previous SMA ' +
            'indicator should be shifted by period (19) thus data should ' +
            'have 19 fewer points.'
        ).toBe(19);

        await openIndicators(page);

        await expect(option('SMA (20)')).toBeAttached();

        // Open EDIT bookmark.
        await page.locator('.highcharts-tab-item').nth(1).click();

        await expect(option('SMA (20)')).toBeAttached();
        await expect(option('SMA (20)')).not.toContainText('SMA (14)');
    });
});
