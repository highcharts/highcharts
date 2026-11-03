import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage } from '~/helpers.ts';
import {
    dropComponent,
    grabComponent,
    hideSidebar,
    toggleEditMode,
    waitForBoard
} from './helpers.ts';

const confirmButton = '.highcharts-dashboards-edit-confirmation-popup-confirm-btn';

/**
 * The number of cells in the first row and the type of the last component.
 */
async function getLastAdded(page: Page): Promise<{
    cells: number;
    type: string;
}> {
    await waitForBoard(page);
    return page.evaluate(() => {
        const board = (window as any).Dashboards.boards[0];
        const m = board.mountedComponents;

        return {
            cells: board.layouts[0].rows[0].cells.length,
            type: m[m.length - 1].component.type
        };
    });
}

test.describe('Add components through UI', () => {
    test.use({ viewport: { width: 1200, height: 1000 } });

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/add-layout');
        await toggleEditMode(page);
    });

    test('should close the add component sidebar, clicking outside', async ({ page }) => {
        await page.locator('.highcharts-dashboards-edit-tools-btn', {
            hasText: 'Add'
        }).click({ force: true });
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .toBeAttached();
        await expect(page.locator('.highcharts-dashboards-edit-overlay-active'))
            .toBeAttached();

        await trigger(page.locator('#dashboard-col-1').first(), 'click', {
            force: true
        });

        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .not.toHaveClass(/\bhighcharts-dashboards-edit-sidebar-show\b/);
    });

    test('should be able to add a layout', async ({ page }) => {
        await grabComponent(page, 'Row');
        await dropComponent(page, '#dashboard-col-0');

        await waitForBoard(page);
        expect(
            await page.evaluate(
                () => (window as any).Dashboards.boards[0].layouts.length
            ),
            'New layout should be added.'
        ).toBe(2);
    });

    test('should be able to add a HTML component', async ({ page }) => {
        // drop next to grid
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-col-2');
        await hideSidebar(page);

        // drop between two top cells
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-col-1');
        await hideSidebar(page);

        const added = await getLastAdded(page);
        expect(added.cells, 'New cell should be added in the first row.')
            .toBe(3);
        expect(added.type, 'New component\'s type should be \'HTML\'')
            .toBe('HTML');

        const sizes = await page.evaluate(() => {
            const m = (window as any).Dashboards.boards[0].mountedComponents;
            const height = (el: HTMLElement) =>
                el.getBoundingClientRect().height;

            return {
                // HTML next to grid
                rowHeight: height(m[m.length - 2].cell.row.container),
                cellContentHeight:
                    height(m[m.length - 2].component.contentElement),
                // HTML Component next to containers
                firstCellHeight: height(m[0].component.contentElement),
                lastCellHeight:
                    height(m[m.length - 1].component.contentElement)
            };
        });
        expect(
            sizes.rowHeight,
            'The HTML Component has the same height as Grid'
        ).toBeGreaterThan(sizes.cellContentHeight);
        expect(
            Math.floor(sizes.firstCellHeight),
            'The HTML Component has the same height as siblings'
        ).toBe(Math.floor(sizes.lastCellHeight));

        await page.locator('#dashboard-col-0 > *').click();
        // Hidden toolbars are moved off-screen
        await expect(page.locator(
            '.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-cell > *'
        ).filter({ visible: true }).first()).toBeInViewport();
    });

    test('Board should not crash when removing added component', async ({ page }) => {
        // Act- add HTML component
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-col-2');
        await hideSidebar(page);
        // Remove HTML component
        await page.locator('.highcharts-dashboards-edit-menu-destroy').first()
            .click();
        await page.locator(confirmButton).filter({ visible: true }).click();
        // Act- add HTML component again
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-col-1');

        // Assert
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .toBeAttached();
    });

    test('should be able to add a chart component and resize it', async ({ page }) => {
        const toggle = (i: number) => page
            .locator('.highcharts-dashboards-edit-toggle-container')
            .nth(i)
            .locator('input[type="checkbox"]');

        // Act
        await grabComponent(page, 'chart');
        await dropComponent(page, '#dashboard-col-0');

        // Assert
        await page.locator('.highcharts-dashboards-edit-accordion')
            .getByText('Chart options')
            .first()
            .click();
        // Legend toggle
        await expect(toggle(1)).toBeChecked();
        // Data labels toggle
        await expect(toggle(4)).not.toBeChecked();

        // Assert
        await hideSidebar(page);
        const added = await getLastAdded(page);
        expect(added.cells, 'New cell should be added.').toBe(3);
        expect(added.type, 'New component\'s type should be \'Highcharts\'.')
            .toBe('Highcharts');

        // check values connector
        expect(
            await page.evaluate(() => {
                const m = (window as any).Dashboards.boards[0]
                    .mountedComponents;
                return m[m.length - 1].component.chart.series.length;
            }),
            'Highcharts should display values from CSV data table.'
        ).toBeGreaterThan(0);
    });

    test('Grid component should be added.', async ({ page }) => {
        await grabComponent(page, 'Grid');
        await dropComponent(page, '#dashboard-col-0');
        await hideSidebar(page);

        const added = await getLastAdded(page);
        expect(added.cells, 'New cell should be added.').toBe(3);
        expect(added.type, 'New component\'s type should be \'Grid\'.')
            .toBe('Grid');

        // check values connector
        const columnIds = await page.evaluate(() => {
            const m = (window as any).Dashboards.boards[0].mountedComponents;
            return [
                m[m.length - 2].component.grid.columnIds,
                m[m.length - 1].component.grid.columnIds
            ];
        });
        expect(columnIds[1], 'Grid should display values from CSV data table.')
            .toEqual(columnIds[0]);
    });

    test('KPI component is added.', async ({ page }) => {
        await grabComponent(page, 'KPI');
        await dropComponent(page, '#dashboard-col-0');
        await hideSidebar(page);

        const added = await getLastAdded(page);
        expect(added.cells, 'New cell should be added.').toBe(3);
        expect(added.type, 'New component\'s type should be \'KPI\'.')
            .toBe('KPI');
    });

    test('The component is added to empty dashboard.', async ({ page }) => {
        await page.locator('#dashboard-col-0').click({ force: true });
        await page.locator('.highcharts-dashboards-edit-menu-destroy').first()
            .click();
        await page.locator(confirmButton).click({ force: true });

        await page.locator('#dashboard-col-2').click({ force: true });
        await page.locator('.highcharts-dashboards-edit-menu-destroy').first()
            .click({ force: true });
        await page.locator(confirmButton).click({ force: true });

        await grabComponent(page, 'chart');
        await dropComponent(page, '.highcharts-dashboards-wrapper');
        await hideSidebar(page);

        const added = await getLastAdded(page);
        expect(added.cells, 'New cell should be added.').toBe(1);
        expect(added.type, 'New component\'s type should be \'Highcharts\'.')
            .toBe('Highcharts');
    });
});

for (const [title, sample] of [
    ['Edit mode with toolbars disabled', 'toolbars-disabled'],
    [
        'Edit mode with add component button disabled',
        'add-component-button-disabled'
    ]
]) {
    test.describe(title, () => {
        const getPage = useSharedPage(`/dashboards/edit-mode/${sample}`);

        test.beforeAll(async () => {
            await toggleEditMode(getPage());
        });

        test('Add component button should not exist.', async () => {
            await expect(getPage().locator('.highcharts-dashboards-edit-tools-btn'))
                .toHaveCount(0);
        });
    });
}
