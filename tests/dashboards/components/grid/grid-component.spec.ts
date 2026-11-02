import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import {
    openCellEditSidebar,
    testViewport,
    toggleEditMode,
    trigger,
    typeAtEnd,
    useSharedPage,
    waitForBoard,
    waitForChart
} from '../../helpers.ts';

const accordionButton = '.highcharts-dashboards-edit-accordion-header-btn';
const confirmButton = '.highcharts-dashboards-edit-confirmation-popup-confirm-btn';

/**
 * The control in front of a sidebar label, e.g. its checkbox.
 */
function labelControl(page: Page, text: string) {
    return page.locator('.highcharts-dashboards-edit-label-text', {
        hasText: text
    }).first().locator('xpath=preceding-sibling::*[1]');
}

async function openAccordion(page: Page, text: string): Promise<void> {
    await page.locator(accordionButton, { hasText: text }).first().click();
}

async function openGridGeneralOptions(page: Page): Promise<void> {
    await toggleEditMode(page);
    await openCellEditSidebar(page, '#dashboard-col-1');
    await openAccordion(page, 'Grid options');
    await openAccordion(page, 'General');
}

// Tests that both samples share

async function columnAssignment(page: Page): Promise<void> {
    await expect(page.locator('th')).toHaveCount(2);
    await waitForChart(page);
    expect(
        await page.evaluate(() => Highcharts.charts[0].series.length),
        'The chart should have only one series.'
    ).toBe(1);
}

async function syncedHover(page: Page): Promise<void> {
    // Arrange
    const firstGridRow = page.locator('tr.hcg-row').nth(0);
    const secondGridRow = page.locator('tr.hcg-row').nth(1);
    const firstCell = firstGridRow.locator('> *').nth(0);

    // Act - hover over Grid Component.
    await trigger(firstCell, 'mouseover');

    // Assert - hover over Grid Component.
    await expect(firstGridRow).toHaveClass(/\bhcg-hovered-row\b/);
    await expect(firstCell).toHaveClass(/\bhcg-hovered-column\b/);
    await expect(firstGridRow.locator('> *').nth(1))
        .not.toHaveClass(/\bhcg-hovered-column\b/);
    await waitForChart(page);
    expect(
        await page.evaluate(
            () => (Highcharts.charts[0] as any).tooltip.isHidden
        ),
        'When hovering over Grid, chart should have tooltip.'
    ).toBeFalsy();
    await trigger(firstCell, 'mouseout');

    // Act - hover over the chart.
    await trigger(page.locator('.highcharts-point').nth(1), 'mouseover');

    // Assert - synced over the chart.
    await expect(firstGridRow).not.toHaveClass(/\bhcg-synced-row\b/);
    await expect(secondGridRow).toHaveClass(/\bhcg-synced-row\b/);
    await expect(secondGridRow.locator('> *').nth(0))
        .not.toHaveClass(/\bhcg-synced-column\b/);
    await expect(secondGridRow.locator('> *').nth(1))
        .toHaveClass(/\bhcg-synced-column\b/);
}

async function storeUpdate(page: Page): Promise<void> {
    // Act
    await page.locator('tr.hcg-row').nth(1).locator('> *').nth(1)
        .dblclick();
    for (let i = 0; i < 3; ++i) {
        await page.keyboard.press('Backspace');
    }
    await page.keyboard.type('000');
    await page.keyboard.press('Enter');

    // Assert
    await expect.poll(
        () => page.evaluate(
            () => Highcharts.charts[0].series[0].points[1].y
        ),
        'After updating the Grid the chart should be updated.'
    ).toBe(2000);
}

async function syncedExtremes(page: Page): Promise<void> {
    const tbody = page.locator('tbody').first();
    const chart = page
        .locator('.highcharts-dashboards-component-highcharts-content')
        .first();

    // Arrange
    const containerTop = await tbody.evaluate(el => el.scrollTop);

    // Act
    await trigger(chart, 'mousedown', { position: [300, 0] });
    await trigger(chart, 'mousemove', { position: [300, 100] });
    await trigger(chart, 'mouseup');

    // Assert
    expect(
        await tbody.evaluate(el => el.scrollTop),
        'When selecting a range in the chart, the Grid Component should scroll.'
    ).toBeGreaterThan(containerTop);
}

async function seriesVisibility(page: Page): Promise<void> {
    await page.locator('.highcharts-legend-item').nth(0).click();
    await expect(page.locator('th')).toHaveCount(1);
    await page.locator('.highcharts-legend-item').nth(0).click();
    await expect(page.locator('th')).toHaveCount(2);
}

async function pointDrag(page: Page): Promise<void> {
    await waitForBoard(page);
    expect(
        await page.evaluate(() => {
            const board = (window as any).Dashboards.boards[0];
            const points = board.mountedComponents[0].component
                .chart.series[0].points;

            // simulate dragging
            points[points.length - 1].update(2000);
            // grid component
            try {
                board.mountedComponents[1].component.connectorHandlers[0]
                    .connector.getTable().emit({ type: 'afterSetCell' });
            } catch {
                return true;
            }
            return false;
        }),
        'Error in reference to cells should not be thrown.'
    ).toBe(false);
}

async function gridOptions(page: Page): Promise<void> {
    await expect(page.locator('th').nth(1)).toContainText('Vitamin A (IU)');
}

test.describe('Grid Component', () => {
    test.use({ viewport: testViewport });

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/component-grid');
    });

    test('The columnAssignment should be respected', async ({ page }) => {
        await columnAssignment(page);
    });

    test('Chart and Grid Component should have synced hover events.', async ({ page }) => {
        await syncedHover(page);
    });

    test('Updating of the store should work by changing chart and grid', async ({ page }) => {
        await storeUpdate(page);
    });

    // Known failure, also before the move to Playwright
    test.fail('Chart and Grid Component should have synced extremes events.', async ({ page }) => {
        await syncedExtremes(page);
    });

    test('Toggling series visibility should change hide/show column in Grid Component', async ({ page }) => {
        await seriesVisibility(page);
    });

    test('Grid Component should not throw error when dragging point on chart.', async ({ page }) => {
        await pointDrag(page);
    });

    test('The gridOptions should be applied to the component.', async ({ page }) => {
        await gridOptions(page);
    });

    // Known failure, also before the move to Playwright
    test.fail('The editableOptions should be visible in the sidebar and should show the correct values.', async ({ page }) => {
        await openGridGeneralOptions(page);

        for (const [label, checked] of [
            ['Editable Grid', true],
            ['Resizable columns', true],
            ['Sortable columns', true]
        ] as const) {
            await expect(page.locator('.highcharts-dashboards-edit-label-text', {
                hasText: label
            }).first()).toBeVisible();
            await expect(labelControl(page, label)
                .locator('input[type="checkbox"]')).toBeChecked({ checked });
        }

        await expect(page.locator('.highcharts-dashboards-edit-label-text', {
            hasText: 'Columns resizing mode'
        }).first()).toBeVisible();
        await expect(page.locator(
            '.highcharts-dashboards-edit-dropdown.highcharts-dashboards-edit-collapsable-content-header'
        ).nth(1).locator(
            '.highcharts-dashboards-edit-dropdown-button-content > span'
        )).toHaveText('adjacent');

        await expect(page.locator('.highcharts-dashboards-edit-label-text', {
            hasText: 'Cell text truncation'
        }).first()).toBeVisible();
        await expect(labelControl(page, 'Cell text truncation')
            .locator('input[type="checkbox"]')).not.toBeChecked();
    });

    // Known failure, also before the move to Playwright
    test.fail('Changing options in the sidebar should update the grid.', async ({ page }) => {
        // Arrange
        await openGridGeneralOptions(page);

        // Assert
        await expect(page.locator('.hcg-column-sortable').first())
            .toBeAttached();

        // Act
        await labelControl(page, 'Sortable columns').click();
        await page.locator(confirmButton).nth(0).click();

        // Assert
        await expect(page.locator('.hcg-column-sortable')).toHaveCount(0);
    });

    test('Discarding changes should not be applied to the grid.', async ({ page }) => {
        // Assert
        await expect(page.locator('.hcg-column-sortable').first())
            .toBeAttached();

        // Act
        await openGridGeneralOptions(page);
        await labelControl(page, 'Sortable columns').click();
        await page.locator(
            '.highcharts-dashboards-edit-confirmation-popup-cancel-btn'
        ).click();
        await page.locator(confirmButton).nth(1).click();

        // Assert
        await expect(page.locator('.hcg-column-sortable').first())
            .toBeAttached();
    });

    test('Applying class name to the component should work.', async ({ page }) => {
        await expect(page.locator('.highcharts-grid-container').first())
            .toBeAttached();

        // Arrange
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-1');

        // Act
        await openAccordion(page, 'Grid class name');
        await typeAtEnd(page.locator('input[name="Grid class name"]'), '-lama');
        await page.locator(confirmButton).nth(0).click();

        // Assert
        await expect(page.locator('.highcharts-grid-container-lama').first())
            .toBeAttached();
    });
});

test.describe('Grid Component with custom HTML', () => {
    const getPage = useSharedPage(
        '/dashboards/cypress/component-grid-custom-html'
    );

    test('The columnAssignment should be respected', async () => {
        await columnAssignment(getPage());
    });

    test('Chart and Grid Component should have synced hover events.', async () => {
        await syncedHover(getPage());
    });

    test('Updating of the store should work by changing chart and grid', async () => {
        await storeUpdate(getPage());
    });

    // Known failure, also before the move to Playwright
    test.fail('Chart and Grid Component should have synced extremes events.', async () => {
        await syncedExtremes(getPage());
    });

    test('Toggling series visibility should change hide/show column in Grid Component', async () => {
        await seriesVisibility(getPage());
    });

    test('Grid Component should not throw error when dragging point on chart.', async () => {
        await pointDrag(getPage());
    });

    test('The gridOptions should be applied to the component.', async () => {
        await gridOptions(getPage());
    });
});
