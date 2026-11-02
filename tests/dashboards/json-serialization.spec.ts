import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import {
    dropComponent,
    editChartOptionsInSidebar,
    grabComponent,
    testViewport,
    toggleEditMode,
    trigger,
    waitForBoard
} from './helpers.ts';

/**
 * The serialized options of the board.
 */
async function getJSON(page: Page): Promise<any> {
    await waitForBoard(page);
    return page.evaluate(
        () => (window as any).Dashboards.boards[0].getOptions()
    );
}

test.use({ viewport: testViewport });

test.describe('JSON serialization - gui enabled', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/dashboard-layout');
    });

    test('Component\'s state should be updated, after actions in sidebar', async ({ page }) => {
        await toggleEditMode(page);

        await page.locator('.highcharts-dashboards-component').first().click();
        await page.locator(
            '.highcharts-dashboards-edit-toolbar-cell > ' +
            '.highcharts-dashboards-edit-toolbar-item:nth-child(2)'
        ).click();

        await editChartOptionsInSidebar(page);

        // call update
        await page.getByText(/Confirm/u).first().click();
        const json = await getJSON(page);
        const component = await page.evaluate(() => (window as any).Dashboards
            .boards[0].mountedComponents[0].component.options.chartOptions);
        const serialized = json.components[0].chartOptions;

        expect(serialized.chart.type, 'New chart options are applied on chart.')
            .toBe(component.chart.type);
        expect(serialized.title, 'New title options are applied on chart.')
            .toEqual(component.title);
        expect(serialized.subtitle, 'New subtitle options are applied on chart.')
            .toEqual(component.subtitle);
        expect(serialized.legend, 'New legend options are applied on chart.')
            .toEqual(component.legend);
        expect(serialized.xAxis[0], 'New xAxis options are applied on chart.')
            .toEqual(component.xAxis[0]);
        expect(serialized.yAxis[0], 'New yAxis options are applied on chart.')
            .toEqual(component.yAxis[0]);
        expect(
            serialized.plotOptions,
            'New data labels options are applied on chart.'
        ).toEqual(component.plotOptions);
        expect(serialized.tooltip, 'New tooltip options are applied on chart.')
            .toEqual(component.tooltip);
    });

    test('Should save state after dragging.', async ({ page }) => {
        await toggleEditMode(page);
        await page.locator('#cell-1').click();
        await trigger(
            page.locator('.highcharts-dashboards-edit-toolbar-cell > *').first(),
            'mousedown'
        );
        await trigger(page.locator('#cell-2').first(), 'mousemove', {
            position: 'bottom'
        });
        await trigger(page.locator('#cell-2').first(), 'mouseup', {
            position: 'bottom'
        });

        expect(
            (await getJSON(page)).gui.layouts[0].rows.length,
            'Two rows should be present.'
        ).toBe(2);
    });

    test('Should save state after removing cell.', async ({ page }) => {
        await toggleEditMode(page);
        await page.locator('.highcharts-dashboards-component').first().click();
        await page.locator('.highcharts-dashboards-edit-toolbar-cell > *').nth(2)
            .click();

        await page.locator('button', { hasText: 'Confirm' }).first().click();

        expect(
            (await getJSON(page)).gui.layouts[0].rows[0].cells.length,
            'One cell should be present.'
        ).toBe(1);
    });

    test('Should save state after add new layout.', async ({ page }) => {
        await toggleEditMode(page);
        await grabComponent(page, 'Row');
        await dropComponent(page, '#cell-2');

        expect(
            (await getJSON(page)).gui.layouts.length,
            'New layout should be added.'
        ).toBe(2);
    });

    test('Should save state after add new component.', async ({ page }) => {
        await toggleEditMode(page);
        await grabComponent(page, 'chart');
        await dropComponent(page, '#cell-2');

        const json = await getJSON(page);
        expect(json.gui.layouts[0].rows[0].cells.length, 'New cell should be added.')
            .toBe(3);
        expect(json.components.length, 'New component should be added.')
            .toBe(3);
    });
});

test.describe('JSON serialization - custom layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/gui/custom-layout');
    });

    test('Should not have gui object when custom layout is used.', async ({ page }) => {
        expect((await getJSON(page)).gui).toBeUndefined();
    });
});
