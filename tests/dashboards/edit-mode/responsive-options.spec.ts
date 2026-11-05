import { devices } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { useSharedPage } from '~/helpers.ts';

test.describe('Responsive options.', () => {
    const getPage = useSharedPage(
        '/dashboards/cypress/respo-options',
        page => page.setViewportSize({ width: 1200, height: 1000 })
    );

    test('The nested layout should apply responsive options on resize', async () => {
        const page = getPage();
        const width = (selector: string) => page.locator(selector).evaluate(
            el => el.getBoundingClientRect().width
        );

        // Change the viewport to a mobile device.
        await page.setViewportSize(devices['iPhone X'].viewport);

        await expect.poll(
            async () => await width('#cell-1') / await width('#row')
        ).toBeGreaterThan(0.8);
    });
});
