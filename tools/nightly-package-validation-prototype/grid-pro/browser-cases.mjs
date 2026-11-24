export const consumerStartedAttachment = 'consumer-check-started';

export const browserCases = [
    {
        id: 'Grid Pro renders styled rows and commits a numeric cell edit',
        page: 'app/grid-pro.html',
        modules: [
            'es-modules/masters/grid-pro.src.js',
            'css/grid-pro.css'
        ],
        async check(page, expect) {
            const grid = page.locator('#grid');
            const table = grid.locator('table');
            const fruitCells = table.locator('tbody tr td[data-column-id="fruit"]');
            const quantityCells = table.locator('tbody tr td[data-column-id="quantity"]');
            const lastEdit = page.locator('#last-edit');
            // Editable cells can include an accessibility hint after the value.
            const quantityText = value => new RegExp(`^${value}(?:, .*)?$`, 'u');

            await expect(table).toBeVisible();
            await expect(table).toHaveCSS('table-layout', 'fixed');
            await expect(fruitCells).toHaveText(['Pear', 'Apple']);
            await expect(quantityCells).toHaveText([quantityText(2), quantityText(5)]);
            await expect(lastEdit).toBeEmpty();
            expect(await page.evaluate(() => window.getSourceQuantity())).toBe(2);

            await quantityCells.first().dblclick();
            const editor = grid.getByRole('spinbutton');
            await expect(editor).toHaveValue('2');
            await editor.fill('7');
            await editor.press('Enter');

            await expect(editor).toBeHidden();
            await expect(quantityCells).toHaveText([quantityText(7), quantityText(5)]);
            await expect(lastEdit).toHaveText('quantity: 7 (number)');
            await expect.poll(() => page.evaluate(() => window.getSourceQuantity())).toBe(7);
        }
    }
];
