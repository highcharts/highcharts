import { test, expect } from '~/fixtures.ts';

test.describe('Table layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/e2e/table-layout/', {
            waitUntil: 'networkidle'
        });
        await page.waitForFunction(() => {
            const grids = (window as any).Grid?.grids;

            return grids?.length === 2 &&
                (window as any).matrixGrid &&
                (window as any).cardsGrid;
        });
    });

    test('Matrix keeps grid cells and equal row heights', async ({ page }) => {
        await expect(page.locator('#matrix .hcg-layout-matrix')).toHaveCount(1);
        await expect(page.locator('#matrix .hcg-card')).toHaveCount(0);

        const nowrap = await page.locator('#matrix .hcg-cell').first()
            .evaluate((cell) => cell.closest('tbody')?.classList
                .contains('hcg-rows-content-nowrap'));

        expect(nowrap).toBe(true);

        const overflow = await page.locator('#matrix .hcg-cell').first()
            .evaluate((cell) => getComputedStyle(cell).overflow);

        expect(overflow).toBe('visible');
    });

    test('Cards add a card class and hide the header', async ({ page }) => {
        const cells = page.locator('#cards .hcg-cell');

        await expect(page.locator('#cards .hcg-layout-cards')).toHaveCount(1);
        await expect(page.locator('#cards thead')).toHaveCount(0);
        await expect(cells).toHaveCount(4);
        await expect(cells.first()).toHaveClass(/hcg-card/);
    });

    test('An explicit strictHeights value is kept', async ({ page }) => {
        await page.evaluate(async () => {
            await (window as any).matrixGrid.update({
                rendering: {
                    rows: {
                        strictHeights: false
                    }
                }
            });
        });

        await expect(page.locator('#matrix .hcg-rows-content-nowrap'))
            .toHaveCount(0);
        await expect(page.locator('#matrix .hcg-layout-matrix')).toHaveCount(1);
    });
});
