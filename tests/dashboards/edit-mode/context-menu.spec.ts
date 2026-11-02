import { test, expect } from '~/fixtures.ts';
import { toggleEditMode, useSharedPage } from '../helpers.ts';

test.describe('Context menu.', () => {
    const getPage = useSharedPage(
        '/dashboards/cypress/add-layout',
        page => page.setViewportSize({ width: 1200, height: 1000 })
    );

    test('Click on the button should fire the callback.', async () => {
        const page = getPage();

        await toggleEditMode(page);

        await page.locator('.highcharts-dashboards-edit-menu-item', {
            hasText: 'Context menu click test'
        }).first().click();

        await expect(page.locator('.highcharts-dashboards-wrapper'))
            .toHaveClass(/\bcontext-menu-button-clicked\b/);
    });
});
