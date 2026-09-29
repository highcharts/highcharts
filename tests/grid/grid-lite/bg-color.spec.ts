import { test, expect } from '~/fixtures.ts';

test.use({ colorScheme: 'dark' });

test.describe('Page background using --highcharts-* variables in dark mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/bg-color');
    });

    // #cbc forces `color-scheme: light` to mimic an embedding context such as
    // jsFiddle. In dark mode its background must still be dark, which only holds
    // if the page-level --highcharts-* variables use concrete
    // `@media (prefers-color-scheme)` values rather than light-dark(), whose
    // result would otherwise be pinned to the forced light scheme.
    test('background follows the OS even when the element is forced to color-scheme: light', async ({ page }) => {
        await expect(page.locator('#cbc'))
            .toHaveCSS('background-color', 'rgb(20, 20, 20)');
    });
});
