import { test, expect } from '~/fixtures.ts';
import {
    dropComponent,
    editChartOptionsInSidebar,
    grabComponent,
    sidebarChartOptions,
    toggleEditMode,
    waitForBoard
} from './helpers.ts';

const settingsButton = '.highcharts-dashboards-edit-toolbar-cell > ' +
    '.highcharts-dashboards-edit-toolbar-item:nth-child(2)';

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Editable component options', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/dashboard-layout');
        await toggleEditMode(page);
    });

    test('should be able update chart ID via edit mode GUI', async ({ page }) => {
        const newChartID = 'myNewChart';

        await page.locator('.highcharts-dashboards-component').first().click();
        await page.locator(settingsButton).click();

        // type new value
        const accordion = page.locator('.highcharts-dashboards-edit-accordion')
            .last();
        await accordion.click();
        await accordion.locator('input[name="chartID"]').fill(newChartID);

        // call update
        await page.getByText(/Confirm/u).first().click();
        await waitForBoard(page);
        expect(
            await page.evaluate(() => (window as any).Dashboards.boards[0]
                .mountedComponents[0].component.options.chartID),
            'New chartID is applied.'
        ).toBe(newChartID);
    });

    test('Sidebar should not be visible after update.', async ({ page }) => {
        // Hidden sidebars are moved off-screen
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .not.toBeInViewport();
    });

    test('Chart options should be updated via edit mode GUI', async ({ page }) => {
        const expected = sidebarChartOptions;

        await page.locator('.highcharts-dashboards-component').first().click();
        await page.locator(settingsButton).click();

        await editChartOptionsInSidebar(page);

        // call update
        await page.getByText(/Confirm/u).first().click();
        await waitForBoard(page);
        const userOptions = await page.evaluate(() => {
            const options = (window as any).Dashboards.boards[0]
                .mountedComponents[0].component.chart.userOptions;
            return {
                chartType: options.chart.type,
                title: options.title,
                subtitle: options.subtitle,
                legend: options.legend,
                xAxis: options.xAxis[0],
                yAxis: options.yAxis[0],
                dataLabels: options.plotOptions.series.dataLabels,
                tooltip: options.tooltip
            };
        });

        expect(userOptions.chartType, 'New chart options are applied on chart.')
            .toBe(expected.chart.type);
        expect(userOptions.title, 'New title options are applied on chart.')
            .toEqual(expected.title);
        expect(userOptions.subtitle, 'New subtitle options are applied on chart.')
            .toEqual(expected.subtitle);
        expect(userOptions.legend, 'New legend options are applied on chart.')
            .toEqual(expected.legend);
        expect(userOptions.xAxis, 'New xAxis options are applied on chart.')
            .toEqual(expected.xAxis);
        expect(userOptions.yAxis, 'New yAxis options are applied on chart.')
            .toEqual(expected.yAxis);
        expect(
            userOptions.dataLabels,
            'New data labels options are applied on chart.'
        ).toEqual(expected.plotOptions.series.dataLabels);
        expect(userOptions.tooltip, 'New tooltip options are applied on chart.')
            .toEqual(expected.tooltip);
    });
});

test.describe('Toolbar settings disabled.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/edit-mode/settings-disabled');
        await toggleEditMode(page);
        await page.locator('.highcharts-dashboards-component').first().click();
    });

    test('Settings button should not exist in cell toolbars.', async ({ page }) => {
        await expect(page.locator('.highcharts-dashboards-edit-toolbar-cell > *'))
            .toHaveCount(2);
    });

    test('Settings button should not exist in row toolbars.', async ({ page }) => {
        await expect(page.locator('.highcharts-dashboards-edit-toolbar-row > *'))
            .toHaveCount(2);
    });

    test('When adding a component, the popup should not be visible.', async ({ page }) => {
        // Act
        await grabComponent(page, 'chart');
        await dropComponent(page, '#dashboard-col-0');

        // Assert
        await expect(page.locator('.highcharts-dashboards-edit-overlay-active'))
            .toHaveCount(0);
        // Hidden sidebars are moved off-screen
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .not.toBeInViewport();
    });
});
