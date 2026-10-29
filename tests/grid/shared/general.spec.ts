import { test, expect } from '~/fixtures.ts';

test.describe('Rendering hidden grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/hidden', { waitUntil: 'networkidle' });
    });

    test('Rows should be visible when grid is switched from hidden', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Act - click show button
        await page.locator('#show').click();

        // Wait for grid to render after show button click
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should be visible (4 data rows + 1 header row = 5 total)
        await expect(page.locator('tr')).toHaveCount(5);
    });

    test('Rows should have even and odd classes', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Click show button to make grid visible
        await page.locator('#show').click();

        // Wait for grid to render
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should have alternating classes
        await expect(page.locator('tbody tr').first()).toHaveClass(/hcg-row-odd/);
        await expect(page.locator('tbody tr').nth(1)).toHaveClass(/hcg-row-even/);
    });

    test('Body cells should have a common class', async ({ page }) => {
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        await page.locator('#show').click();
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        const cells = page.locator('tbody tr').first().locator('> *');
        await expect(cells).toHaveCount(4);
        for (const cell of await cells.all()) {
            await expect(cell).toHaveClass(/\bhcg-cell\b/);
        }
    });

    test('Row header cells should have the common cell class', async ({ page }) => {
        await page.evaluate(async () => {
            const container = document.createElement('div');
            container.id = 'row-header-grid';
            document.body.appendChild(container);

            await (window as any).Grid.grid('row-header-grid', {
                data: {
                    columns: {
                        name: ['Ada'],
                        value: [1]
                    }
                },
                columns: [{
                    id: 'name',
                    cells: {
                        rowHeader: true
                    }
                }]
            }, true);
        });

        const row = page.locator('#row-header-grid tbody tr').first();

        const nameCell = row.locator('> [data-column-id="name"]');
        expect(await nameCell.evaluate(el => el.tagName)).toBe('TH');
        await expect(nameCell).toHaveClass(/\bhcg-cell\b/);
        await expect(nameCell).toHaveAttribute('scope', 'row');
        await expect(nameCell).toHaveAttribute('role', 'rowheader');

        const valueCell = row.locator('> [data-column-id="value"]');
        expect(await valueCell.evaluate(el => el.tagName)).toBe('TD');
        await expect(valueCell).toHaveClass(/\bhcg-cell\b/);
    });
});

test.describe('Grid rows removal', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/basic/destroy-grid');
    });

    test('Remove all grid rows', async ({ page }) => {
        await page.locator('#delete-rows-btn').click();
        // All grid rows should be removed.
        await expect(page.locator('tbody')).toBeEmpty();
    });
});

test.describe('Rendering size', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/rendering-size');
    });

    test('Fixed height grid', async ({ page }) => {
        const height = await page.locator('#container').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Percentage height grid inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid2').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Max height inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid3').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('180px');
    });

    test('Flex grow inside fixed flexbox', async ({ page }) => {
        const height = await page.locator('#grid4').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });
});

