import { test, expect } from '~/fixtures.ts';

test.describe('Pinned row cell editing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        // Create a grid with both pinning and cell editing enabled
        await page.evaluate(() => {
            const container = document.createElement('div');
            container.id = 'test-grid';
            container.style.width = '800px';
            container.style.height = '400px';
            document.body.appendChild(container);

            const Grid = (window as any).Grid;
            (window as any).testGrid = Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['A', 'B', 'C', 'D', 'E'],
                        product: [
                            'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges'
                        ],
                        price: [1.5, 2.5, 3.5, 4.5, 5.5]
                    }
                },
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'id',
                            topIds: ['A'],
                            bottomIds: ['E']
                        }
                    }
                },
                columnDefaults: {
                    cells: {
                        editMode: {
                            enabled: true
                        }
                    }
                },
                columns: [{
                    id: 'id',
                    cells: {
                        editMode: { enabled: false }
                    }
                }, {
                    id: 'product'
                }, {
                    id: 'price',
                    dataType: 'number'
                }]
            });
        });

        // Wait for the grid to render pinned rows
        await page.locator(
            '#test-grid .hcg-tbody-pinned-top.hcg-tbody-pinned-active'
        ).waitFor();
    });

    const grid = '#test-grid';

    test('can edit a cell in a pinned row', async ({ page }) => {
        const cell = page.locator(
            `${grid} .hcg-tbody-pinned-top tr td[data-column-id="product"]`
        );

        await expect(cell).toHaveAttribute('data-value', 'Apples');

        // Double-click to enter edit mode
        await cell.dblclick();

        // Verify input appeared
        const input = cell.locator('input');
        await expect(input).toBeVisible();

        // Clear and type new value
        await input.fill('Mangoes');
        await page.keyboard.press('Enter');

        // Verify the edit was saved
        await expect(cell).toHaveAttribute('data-value', 'Mangoes');
    });

    test('unpinning a row cancels active editing', async ({ page }) => {
        const pinnedCell = page.locator(
            `${grid} .hcg-tbody-pinned-top tr td[data-column-id="product"]`
        );

        await expect(pinnedCell).toHaveAttribute('data-value', 'Apples');

        // Double-click to enter edit mode
        await pinnedCell.dblclick();
        const input = pinnedCell.locator('input');
        await expect(input).toBeVisible();

        // Type a new value but do NOT press Enter
        await input.fill('ShouldBeDiscarded');

        // Unpin the row via API
        await page.evaluate(async () => {
            await (window as any).testGrid.unpinRow('A');
        });

        // Verify no edit input remains anywhere
        await expect(
            page.locator(`${grid} .hcg-cell-editing-container`)
        ).toHaveCount(0);

        // The original value should be preserved (edit was discarded)
        const scrollableCell = page.locator(
            `${grid} .hcg-tbody-scrollable ` +
            'tr[data-row-index="0"] td[data-column-id="product"]'
        );
        await expect(scrollableCell).toHaveAttribute('data-value', 'Apples');
    });

    test('pinning a scrollable row cancels active editing', async ({
        page
    }) => {
        // Find a cell in the scrollable area (Pears is at index 1)
        const cell = page.locator(
            `${grid} .hcg-tbody-scrollable ` +
            'tr[data-row-index="1"] td[data-column-id="product"]'
        ).first();

        await expect(cell).toHaveAttribute('data-value', 'Pears');

        // Double-click to enter edit mode
        await cell.dblclick();
        const input = cell.locator('input');
        await expect(input).toBeVisible();

        // Type a new value but do NOT press Enter
        await input.fill('ShouldBeDiscarded');

        // Pin the row via API
        await page.evaluate(async () => {
            await (window as any).testGrid.pinRow('B', 'top');
        });

        // Verify no edit input remains
        await expect(
            page.locator(`${grid} .hcg-cell-editing-container`)
        ).toHaveCount(0);

        // The original value should be preserved in the newly pinned row
        const pinnedCell = page.locator(
            `${grid} .hcg-tbody-pinned-top ` +
            'tr td[data-column-id="product"]'
        ).last();
        await expect(pinnedCell).toHaveAttribute('data-value', 'Pears');
    });

    test('completed edit persists after unpinning', async ({ page }) => {
        const pinnedCell = page.locator(
            `${grid} .hcg-tbody-pinned-top tr td[data-column-id="product"]`
        );

        await expect(pinnedCell).toHaveAttribute('data-value', 'Apples');

        // Edit and save the value
        await pinnedCell.dblclick();
        const input = pinnedCell.locator('input');
        await expect(input).toBeVisible();
        await input.fill('Mangoes');
        await page.keyboard.press('Enter');

        // Verify the edit was saved in the pinned row
        await expect(pinnedCell).toHaveAttribute('data-value', 'Mangoes');

        // Now unpin the row
        await page.evaluate(async () => {
            await (window as any).testGrid.unpinRow('A');
        });

        // The edited value should persist in the scrollable area
        const scrollableCell = page.locator(
            `${grid} .hcg-tbody-scrollable ` +
            'tr[data-row-index="0"] td[data-column-id="product"]'
        );
        await expect(scrollableCell).toHaveAttribute('data-value', 'Mangoes');
    });
});
