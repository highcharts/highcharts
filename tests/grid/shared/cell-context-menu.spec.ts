import { test, expect } from '~/fixtures.ts';

const cases = [
    {
        name: 'Grid Lite',
        url: '/grid-lite/cypress/cell-context-menu'
    },
    {
        name: 'Grid Pro',
        url: '/grid-pro/cypress/cell-context-menu'
    }
];

test.describe('Cell Context Menu', () => {
    for (const c of cases) {
        test.describe(`${c.name}`, () => {
            test.beforeEach(async ({ page }) => {
                await page.setViewportSize({ width: 900, height: 500 });
                await page.goto(c.url, { waitUntil: 'networkidle' });

                await page.waitForFunction(() => {
                    return typeof (window as any).Grid !== 'undefined' &&
                        (window as any).Grid.grids &&
                        (window as any).Grid.grids.length > 0;
                }, { timeout: 10000 });

                await page.waitForFunction(() => {
                    return document.querySelectorAll('tbody td').length > 0;
                }, { timeout: 10000 });
            });

            test('Right-click shows menu and item callback gets context', async ({ page }) => {
                const productCell = page.locator(
                    'tbody tr[data-row-index="1"] td[data-column-id="product"]'
                );

                await productCell.click({ button: 'right' });

                const popup = page.locator('.hcg-popup');
                await expect(popup).toBeVisible();
                await expect(popup).toContainText('Show context');

                await page.locator('.hcg-menu-item', { hasText: 'Show context' }).click();

                await expect(page.locator('#cellContextMenuResult')).toHaveValue('1|product|Pears');
                await expect(popup).toBeHidden();
            });

            test('Right-click with no items keeps native (no popup created)', async ({ page }) => {
                const weightCell = page.locator(
                    'tbody tr[data-row-index="1"] td[data-column-id="weight"]'
                );

                await weightCell.click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toHaveCount(0);
            });
        });
    }
});
