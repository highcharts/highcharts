import { test, expect } from '~/fixtures.ts';
import {
    dropComponent,
    grabComponent,
    openCellEditSidebar,
    sidebarAccordion,
    testViewport,
    toggleEditMode,
    waitForBoard
} from '../../helpers.ts';

const accordionButton = '.highcharts-dashboards-edit-accordion-header-btn';
const confirmButton = '.highcharts-dashboards-edit-confirmation-popup-confirm-btn';

test.use({ viewport: testViewport });

test.describe('Updating HTML component.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/component-html');
    });

    test('Should have the correct class name.', async ({ page }) => {
        await expect(page.locator('#dashboard-2 > *').first())
            .toHaveClass(/\bhighcharts-dashboards-component-html\b/);
    });

    test('Should update the HTML component title and caption.', async ({ page }) => {
        const title = page.locator('.highcharts-dashboards-component-title');
        const caption = page.locator('.highcharts-dashboards-component-caption');

        await expect(title).toHaveText('Title (original)');
        await expect(caption).toHaveText('Caption (original)');

        await waitForBoard(page);
        await page.evaluate(() => {
            (window as any).Dashboards.boards[0].mountedComponents[0]
                .component.update({
                    title: 'Changed title',
                    caption: 'Changed caption'
                });
        });

        await expect(title).toHaveText('Changed title');
        await expect(caption).toHaveText('Changed caption');
    });

    test('HTML content should adjust height when resizing.', async ({ page }) => {
        await waitForBoard(page);
        const height = await page.evaluate(() => (window as any).Dashboards
            .boards[0].mountedComponents[1].cell.container
            .getBoundingClientRect().height);

        // resize the window to squeeze the text inside
        await page.setViewportSize({ width: 600, height: 1000 });

        await expect.poll(() => page.locator('#dashboard-2').evaluate(
            el => el.getBoundingClientRect().height
        )).toBeGreaterThan(height);
    });

    test('Should edit the HTML component with sidebar.', async ({ page }) => {
        // Arrange- open sidebar
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-2');

        // Act- edit the HTML component
        await sidebarAccordion(page, 'HTML').click();
        await page.locator('textarea').fill('<h1>New title</h1>');
        await page.locator(confirmButton).click();

        // Assert- confirm the changes in dashboard and sidebar
        await expect(page.locator('#dashboard-2')).toContainText('New title');
        await openCellEditSidebar(page, '#dashboard-2');
        await sidebarAccordion(page, 'HTML').click();
        await expect(page.locator('textarea')).toHaveValue('<h1>New title</h1>');
    });

    test('Sidebar should be populated when adding a component.', async ({ page }) => {
        // Act
        await toggleEditMode(page);
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-2');
        const html = page.locator(accordionButton).nth(2);
        await html.click();

        // Assert
        await expect(html.locator(
            'xpath=../..//*[contains(@class, "highcharts-dashboards-edit-accordion-content")]//textarea'
        )).toHaveValue(
            '<span>[Your custom HTML here- edit the component]</span>'
        );
    });

    test('Properties should be reflected in the sidebar.', async ({ page }) => {
        const title = page.locator(accordionButton).first();
        const titleInput = title.locator(
            'xpath=../..//*[contains(@class, "highcharts-dashboards-edit-accordion-content")]//input'
        );

        // Act
        await toggleEditMode(page);
        await openCellEditSidebar(page, '#dashboard-1');
        await title.click();

        // Assert
        await expect(titleInput).toHaveValue('Title (original)');

        // Act
        await titleInput.fill('Changed title');
        await page.locator(confirmButton).click();

        // Assert
        await expect(page.locator('#dashboard-1')).toContainText('Changed title');

        // Act
        await openCellEditSidebar(page, '#dashboard-1');
        await title.click();

        // Assert
        await expect(titleInput).toHaveValue('Changed title');
    });

    test('Discarding changes should reset the HTML component', async ({ page }) => {
        const htmlComponents = page.locator('.highcharts-dashboards-component-html');

        // Act
        await toggleEditMode(page);
        await grabComponent(page, 'HTML');
        await dropComponent(page, '#dashboard-1');
        await sidebarAccordion(page, 'HTML').click();
        await page.locator('textarea').fill('<h1>New title</h1>');
        await page.locator('.highcharts-dashboards-edit-confirmation-popup-cancel-btn')
            .click();

        // Assert
        await expect(htmlComponents.nth(1)).toContainText('New title');

        // Act
        await page.locator(confirmButton).nth(1).click();

        // Assert
        await expect(htmlComponents.nth(1)).toContainText(
            '[Your custom HTML here- edit the component]'
        );
    });
});
