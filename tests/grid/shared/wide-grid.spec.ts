import { test, expect } from '~/fixtures.ts';

test.describe('Sorting and resizing wide grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/wide-grid');
    });

    test('scroll position should stay the same after sorting', async ({ page }) => {
        const rowsContent = page.locator('.hcg-rows-content-nowrap');
        await rowsContent.evaluate((el: HTMLElement) => {
            el.scrollLeft = el.scrollWidth;
        });
        await page.locator('.hcg-column-sortable').last().click();
        const scrollLeft = await rowsContent.evaluate(
            (el: HTMLElement) => el.scrollLeft
        );
        expect(scrollLeft).toBeGreaterThan(100);
    });

    test('resizing should be limited by the cell padding', async ({ page }) => {
        const resizer = page.locator('.hcg-column-resizer').last();
        const box = await resizer.boundingBox();
        if (box) {
            await page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(box.x + 100, box.y);
            await page.mouse.up();
        }
        const lastCell = page.locator('.hcg-row td').last();
        const width = await lastCell.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );
        expect(width).toBeGreaterThan(27);
    });
});

