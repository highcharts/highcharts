import { test, expect } from '~/fixtures.ts';
import {
    dropComponent,
    grabComponent,
    hideSidebar,
    toggleEditMode
} from '../helpers.ts';

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Empty board interaction', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/basic/empty-board');
        await toggleEditMode(page);
    });

    test('When component added to an empty board, resize handle should be visible.', async ({ page }) => {
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#container');
        await hideSidebar(page);

        await expect(page.locator('.highcharts-dashboards-edit-resize-snap').first())
            .toBeVisible();
    });

    test('When adding Highcharts component to an empty board, sidebar should be visible.', async ({ page }) => {
        await grabComponent(page, 'Highcharts');
        await dropComponent(page, '#container');

        // Hidden sidebars are moved off-screen
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .toBeInViewport();
    });

    test('Removing row should remove all components and elements from it.', async ({ page }) => {
        // Act
        await grabComponent(page, 'Row');
        await dropComponent(page, '#container');
        await page.locator('.highcharts-dashboards-component-placeholder').click();
        await page.locator(
            '.highcharts-dashboards-edit-toolbar-row ' +
            '.highcharts-dashboards-edit-menu-destroy'
        ).click();
        await page.locator('.highcharts-dashboards-edit-confirmation-popup-confirm-btn')
            .click({ force: true });

        // Assert
        await expect(page.locator('.highcharts-dashboards-edit-resize-snap-y').first())
            .not.toBeInViewport();
        await expect(page.locator('.highcharts-dashboards-row')).toHaveCount(0);
    });
});
