import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { typeAtEnd } from '~/helpers.ts';
import {
    openCellEditSidebar,
    toggleEditMode,
    waitForBoard
} from '../../helpers.ts';

const accordionButton = '.highcharts-dashboards-edit-accordion-header-btn';
const cancelButton = '.highcharts-dashboards-edit-confirmation-popup-cancel-btn';
const confirmButton = '.highcharts-dashboards-edit-confirmation-popup-confirm-btn';
const overlay = '.highcharts-dashboards-edit-overlay-active';

/**
 * Opens the sidebar with the first button of the cell toolbar.
 */
async function openSidebarFromToolbar(page: Page): Promise<void> {
    await page.locator('#dashboard-col-0').click();
    await page.locator('.highcharts-dashboards-edit-toolbar-cell > *').first()
        .click();
}

/**
 * Opens the first two accordions, with the marker radius dropdown.
 */
async function openChartOptions(page: Page): Promise<void> {
    await page.locator(accordionButton).nth(0).click();
    await page.locator(accordionButton).nth(1).click();
}

async function selectMarkerRadius(page: Page, option: number): Promise<void> {
    await page.locator('.highcharts-dashboards-edit-dropdown-button').first()
        .click();
    await page.locator('.highcharts-dashboards-edit-custom-option-button')
        .nth(option)
        .click();
}

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Edit Mode sidebar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/edit-mode-options');
    });

    test('When isStandalone enabled, options should not be nested.', async ({ page }) => {
        await toggleEditMode(page);
        await openSidebarFromToolbar(page);

        // Navigate to the option
        await expect(page.locator('.highcharts-dashboards-edit-standalone-element').first())
            .toBeAttached();
        await expect(
            page.locator('.highcharts-dashboards-edit-accordion-header').first()
                .locator(accordionButton)
        ).toHaveCount(0);

        // Use the standalone input and update component.
        await typeAtEnd(
            page.locator('.highcharts-dashboards-edit-accordion-content').nth(0)
                .locator('input'),
            'test'
        );
        await page.locator(confirmButton).click();

        await waitForBoard(page);
        expect(
            await page.evaluate(() => (window as any).Dashboards.boards[0]
                .mountedComponents[0].component.options.title),
            'Component title should be updated.'
        ).toBe('test');
    });

    test('Values in the sidebar should reflect what is on the chart, #20944.', async ({ page }) => {
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-0');

        // Navigate to the option
        await openChartOptions(page);
        await expect(
            page.locator('.highcharts-dashboards-edit-dropdown-button-content > span')
                .first()
        ).toHaveText('10');
    });

    test('Input should be empty if the title, caption or subtitle disabled, #21079.', async ({ page }) => {
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-1');

        await page.locator(accordionButton).nth(1).click();

        // Assess
        await expect(
            page.locator('.highcharts-dashboards-edit-accordion-content input')
                .first()
        ).toHaveValue('');
    });

    test('Should be able to confirm or cancel changes, #20756.', async ({ page }) => {
        const markerRadius = page.locator('#marker-radius');

        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-0');
        await expect(page.locator(overlay)).toBeAttached();

        // Change options few times
        await openChartOptions(page);
        await selectMarkerRadius(page, 0);
        await expect(markerRadius).toHaveValue('3');

        await selectMarkerRadius(page, 1);
        await expect(markerRadius).toHaveValue('5');
        await expect(page.locator(overlay)).toBeAttached();

        // Cancel changes but discard
        await page.locator(cancelButton).nth(0).click();
        await page.locator(cancelButton).nth(1).click();
        // Wait for the end of the flag change timeout
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(110);
        await expect(page.locator(overlay)).toBeAttached();

        // Cancel changes and accept
        await page.locator(cancelButton).nth(0).click();
        await page.locator(confirmButton).nth(1).click();
        await expect(markerRadius).toHaveValue('10');
        await expect(page.locator(overlay)).toHaveCount(0);

        // Change option again
        await openCellEditSidebar(page, '#dashboard-col-0');
        await openChartOptions(page);
        await selectMarkerRadius(page, 0);
        await expect(page.locator(overlay)).toBeAttached();
        await page.locator(confirmButton).first().click();
        await expect(markerRadius).toHaveValue('3');
        await expect(page.locator(overlay)).toHaveCount(0);
    });

    test('Labels should be displayed only for nested components.', async ({ page }) => {
        const label = (text: string) => page.locator(
            'label.highcharts-dashboards-edit-label-text',
            { hasText: text }
        ).first();

        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-0');

        // Open chart options
        await openChartOptions(page);
        await expect(label('Marker Radius')).toBeVisible();

        // Open connector options
        await page.locator(accordionButton).nth(2).click();
        await expect(label('connectorName')).toBeAttached();
        await expect(label('connectorName')).toBeHidden();
    });

    test('Header should not be accordion, when no nested options, #21955', async ({ page }) => {
        const wrapper = page.locator(
            '.highcharts-dashboards-edit-accordion-standalone-wrapper ' +
            '.highcharts-dashboards-edit-accordion-header-wrapper'
        );

        await toggleEditMode(page);
        await openSidebarFromToolbar(page);

        // Navigate to the option
        await expect(page.locator('.highcharts-dashboards-edit-standalone-element').first())
            .toBeAttached();
        await page.locator('.highcharts-dashboards-edit-accordion-header').nth(2)
            .click();
        await expect(wrapper.first()).toBeAttached();
        await expect(
            wrapper.locator('.highcharts-dashboards-edit-accordion-header-icon')
        ).toHaveCount(0);
    });

    test('Toggle should exist with on and off labels, #23699', async ({ page }) => {
        await toggleEditMode(page);
        await openSidebarFromToolbar(page);

        // Navigate to the option
        const legend = page.locator(
            '.highcharts-dashboards-edit-accordion-content',
            { hasText: 'Legend' }
        ).first();
        for (const text of ['off', 'on']) {
            await expect(legend.locator(
                '.highcharts-dashboards-edit-toggle-labels',
                { hasText: text }
            ).first()).toBeAttached();
        }
    });
});
