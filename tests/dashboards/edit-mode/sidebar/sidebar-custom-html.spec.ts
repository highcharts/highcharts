import { test, expect } from '~/fixtures.ts';
import {
    openCellEditSidebar,
    sidebarAccordion,
    toggleEditMode,
    waitForBoard
} from '../../helpers.ts';

const closeButton = '.highcharts-dashboards-edit-sidebar ' +
    '.highcharts-dashboards-edit-popup-close';
const overlay = '.highcharts-dashboards-edit-overlay-active';

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Edit Mode sidebar', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/custom-html');
    });

    test('Should be able to open and close sidebar and leave the sidebar open.', async ({ page }) => {
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-0');
        await expect(page.locator(overlay)).toBeVisible();
        await page.locator(closeButton).click();
        // Hidden sidebars and toolbars are moved off-screen
        await expect(page.locator('.highcharts-dashboards-edit-sidebar'))
            .not.toBeInViewport();
        await expect(page.locator(overlay)).toHaveCount(0);
        await expect(page.locator('.highcharts-dashboards-edit-toolbar-cell'))
            .toBeInViewport();
    });

    test('Should position sidebar so it do not overlap the components.', async ({ page }) => {
        await toggleEditMode(page);

        await openCellEditSidebar(page, '#dashboard-col-0');
        await expect(page.locator('.highcharts-dashboards-edit-sidebar-right-show'))
            .toBeAttached();
        await page.locator(closeButton).click();

        await openCellEditSidebar(page, '#dashboard-col-1');
        await expect(page.locator('.highcharts-dashboards-edit-sidebar-show'))
            .toBeAttached();
    });

    test('Should be able to use the sidebar to update the component.', async ({ page }) => {
        const legendDisplay = () => page.evaluate(() => (window as any)
            .Dashboards.boards[0].mountedComponents[0].component
            .chart.legend.display);

        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-col-0');
        const chartOptions = sidebarAccordion(page, 'Chart options');

        await waitForBoard(page);
        expect(await legendDisplay(), 'Legend should be visible').toBeTruthy();

        // Change legend
        await chartOptions.click();
        await chartOptions.locator('.highcharts-dashboards-edit-toggle-container')
            .first()
            .click();
        await expect.poll(legendDisplay, 'Legend should be hidden')
            .toBeFalsy();

        // Close sidebar and try to discard changes
        await page.locator(closeButton).click();
        await expect(page.locator('.highcharts-dashboards-edit-confirmation-popup')
            .filter({ visible: true })).toHaveCount(1);
        await expect(page.locator(overlay)).toBeVisible();
    });
});
