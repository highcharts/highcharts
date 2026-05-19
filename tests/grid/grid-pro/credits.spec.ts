import { test, expect } from '~/fixtures.ts';

test.describe('Credits', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/e2e/credits-pro/', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Default credits should be displayed', async ({ page }) => {
        const credits = page.locator('.hcg-credits');
        const bgImage = await credits.evaluate((el) => {
            return window.getComputedStyle(el).backgroundImage;
        });
        expect(bgImage).toContain('https://assets.highcharts.com/grid/logo');
    });

    test('Credits should be configurable', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                credits: {
                    enabled: true,
                    position: 'top',
                    text: 'overwriteText',
                    href: 'https://customurl.com'
                }
            });
        });

        await expect(page.locator('.hcg-credits')).toContainText('overwriteText');
        const bgImage = await page.locator('.hcg-credits').evaluate((el) => {
            return window.getComputedStyle(el).backgroundImage;
        });
        expect(bgImage).toBe('none');
    });

    test('Disabled credits should not be displayed', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                credits: {
                    enabled: false
                }
            });
        });
        await expect(page.locator('.hcg-credits')).toBeHidden();
    });
});

