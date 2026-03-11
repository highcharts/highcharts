import { test, expect } from '~/fixtures.ts';

test.describe('Column distribution strategies', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/column-resizing-mode', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Should be adjacent strategy by default', async ({ page }) => {
        const type = await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            return grid.viewport.columnResizing.type;
        });
        expect(type).toBe('adjacent');
    });

    test('Should be independent strategy when selected', async ({ page }) => {
        await page.locator('#select-distr').selectOption('independent');
        // Wait for the change to take effect
        await page.waitForFunction(() => {
            const grid = (window as any).Grid?.grids?.[0];
            return grid?.viewport?.columnResizing?.type === 'independent';
        }, { timeout: 5000 });
        const type = await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            return grid.viewport.columnResizing.type;
        });
        expect(type).toBe('independent');
    });

    test('Update should not reset column widths if not changed strategy or updated widths directly', async ({ page }) => {
        const cell = page.locator('.hcg-header-cell').first();
        const resizer = cell.locator('.hcg-column-resizer');

        const box = await resizer.boundingBox();
        if (!box) {
            throw new Error('Resizer bounding box not found');
        }

        // Get initial width
        const initialWidth = await cell.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );
        
        // Move to resizer center and start drag
        await page.mouse.move(
            box.x + box.width / 2,
            box.y + box.height / 2
        );
        await page.mouse.down();
        
        // Move left significantly to resize column smaller (Cypress uses pageX: 0)
        // Move to position that will make column < 100px
        await page.mouse.move(50, box.y);
        await page.mouse.up();
        
        // Wait for resize to complete and DOM to update
        await page.waitForFunction(
            (initialWidth) => {
                const cell = document.querySelector('.hcg-header-cell');
                if (!cell) return false;
                return (cell as HTMLElement).offsetWidth !== initialWidth;
            },
            initialWidth,
            { timeout: 5000 }
        );

        await page.locator('#cbx-virt').click();
        
        // Wait for update to complete - wait for checkbox to be checked
        await expect(page.locator('#cbx-virt')).toBeChecked();

        const width = await cell.evaluate((el: HTMLElement) => el.offsetWidth);
        expect(width).toBeLessThan(100);
    });

    test('Resize should change column width in options', async ({ page }) => {
        // First, resize the column (same as previous test)
        const cell = page.locator('.hcg-header-cell').first();
        const resizer = cell.locator('.hcg-column-resizer');

        const box = await resizer.boundingBox();
        if (!box) {
            throw new Error('Resizer bounding box not found');
        }

        // Get initial width
        const initialWidth = await cell.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );
        
        // Move to resizer center and start drag
        await page.mouse.move(
            box.x + box.width / 2,
            box.y + box.height / 2
        );
        await page.mouse.down();
        
        // Move left significantly to resize column smaller (Cypress uses pageX: 0)
        await page.mouse.move(50, box.y);
        await page.mouse.up();
        
        // Wait for resize to complete and options to update
        await page.waitForFunction(
            (initialWidth) => {
                const grid = (window as any).Grid?.grids?.[0];
                if (!grid) return false;
                const cell = document.querySelector('.hcg-header-cell');
                if (!cell) return false;
                return (cell as HTMLElement).offsetWidth !== initialWidth;
            },
            initialWidth,
            { timeout: 5000 }
        );

        // Get width from options - it might be a string (percentage) or number (pixels)
        const width = await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            const widthValue = grid.viewport.columns[0].options.width;
            // If it's a string with percentage, get actual pixel width
            if (typeof widthValue === 'string' && widthValue.includes('%')) {
                return grid.viewport.columns[0].width;
            }
            return widthValue;
        });
        expect(width).toBeLessThan(100);
    });

    test('Remove widths from options should reset column widths to default', async ({ page }) => {
        await page.locator('#btn-remove-widths').click();

        const width = await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            return grid.viewport.columns[0].options.width;
        });
        expect(width).toBeUndefined();
    });
});

