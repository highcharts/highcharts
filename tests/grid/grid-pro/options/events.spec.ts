import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro - grid events', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/e2e/grid-events', { waitUntil: 'networkidle' });
    });

    test('Grid beforeLoad event', async ({ page }) => {
        await expect(page.locator('#beforeLoad')).toHaveValue('beforeLoad');
    });

    test('Grid afterLoad event', async ({ page }) => {
        await expect(page.locator('#afterLoad')).toHaveValue('afterLoad');
    });

    test('Grid beforeUpdate event', async ({ page }) => {
        await expect(page.locator('#beforeUpdate')).toHaveValue('beforeUpdate');
    });

    test('Grid afterUpdate event', async ({ page }) => {
        await expect(page.locator('#afterUpdate')).toHaveValue('afterUpdate');
    });

    test('Grid beforeUpdateColumn event', async ({ page }) => {
        await expect(page.locator('#beforeUpdateColumn')).toHaveValue('beforeUpdateColumn');
    });

    test('Grid afterUpdateColumn event', async ({ page }) => {
        await expect(page.locator('#afterUpdateColumn')).toHaveValue('afterUpdateColumn');

        await expect(page.locator('th[data-column-id="weight"] input')).toHaveValue('50');
        await expect(page.locator('th[data-column-id="weight"] select')).toHaveValue('greaterThan');
        // Use more specific selector for the clear filter button
        await expect(
            page.locator('th[data-column-id="weight"] .hcg-clear-filter-button')
        ).toBeEnabled();
    });

    test('Grid beforeRedraw event', async ({ page }) => {
        await expect(page.locator('#beforeRedraw')).toHaveValue('beforeRedraw');
    });

    test('Grid afterRedraw event', async ({ page }) => {
        await expect(page.locator('#afterRedraw')).toHaveValue('afterRedraw');
    });
});

test.describe('Grid Pro - cell and column events', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/e2e/column-cell-events');
    });

    test('Cell mouseOver / mouseOut event', async ({ page }) => {
        // ColumnDefaults
        const productCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="product"]');
        await productCell.hover();
        await expect(page.locator('#cellMouseOver')).toHaveValue('cellMouseOver');

        await productCell.click();
        await productCell.hover({ force: true });
        await page.mouse.move(0, 0);
        await expect(page.locator('#cellMouseOut')).toHaveValue('cellMouseOut');

        // ColumnOptions
        const weightCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        await weightCell.hover();
        await expect(page.locator('#cellMouseOver')).toHaveValue('cellMouseOverColumnOption');

        await weightCell.click();
        await page.mouse.move(0, 0);
        await expect(page.locator('#cellMouseOut')).toHaveValue('cellMouseOutColumnOption');
    });

    test('Cell click event', async ({ page }) => {
        // ColumnDefaults
        const productCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="product"]');
        await productCell.click({ force: true });
        await expect(page.locator('#cellClick')).toHaveValue('cellClick');

        // ColumnOptions
        const weightCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        await weightCell.click({ force: true });
        await expect(page.locator('#cellClick')).toHaveValue('cellClickColumnOption');
    });

    test('Cell dblClick event', async ({ page }) => {
        // ColumnDefaults
        const productCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="product"]');
        await productCell.dblclick({ force: true });
        await expect(page.locator('#cellDblClick')).toHaveValue('cellDblClick');

        // ColumnOptions
        const weightCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        await weightCell.dblclick({ force: true });
        await expect(page.locator('#cellDblClick')).toHaveValue('cellDblClickColumnOption');
    });

    test('AfterRender event', async ({ page }) => {
        // ColumnDefaults - edit price cell (row 1, column price)
        // Note: afterRender event fires when weight cell (row 1) is re-rendered after editing price
        await expect(page.locator('#cellAfterRender')).toHaveValue('1');
        
        const priceCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="price"]');
        await priceCell.dblclick({ force: true });
        const priceInput = priceCell.locator('input');
        await expect(priceInput).toBeVisible();
        
        // Use page.keyboard.type() like in cell-editing.spec.ts - this ensures proper event handling
        await priceInput.clear();
        await page.keyboard.type('1');
        await page.keyboard.press('Enter');
        
        // Wait for cell to exit edit mode first
        await expect(priceInput).toBeHidden();
        await expect(page.locator('#cellAfterRender')).toHaveValue('1');

        // ColumnOptions - edit weight cell (row 1, column weight)
        const weightCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        await weightCell.dblclick({ force: true });
        const weightInput = weightCell.locator('input');
        await expect(weightInput).toBeVisible();
        
        // Use page.keyboard.type() like in cell-editing.spec.ts - this ensures proper event handling
        await weightInput.clear();
        await page.keyboard.type('1');
        await page.keyboard.press('Enter');
        
        // Wait for cell to exit edit mode first
        await expect(weightInput).toBeHidden();
        
        // Wait for the afterRender callback to fire - it increments the counter
        await expect(page.locator('#cellAfterRender')).toHaveValue('2');
    });

    test('AfterRender header event', async ({ page }) => {
        await expect(page.locator('#headerAfterRender')).toHaveValue('afterRender');
    });

    test('Cell afterEdit event', async ({ page }) => {
        // ColumnDefaults
        const productCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="product"]');
        await productCell.dblclick({ force: true });
        await productCell.locator('input').clear();
        await productCell.locator('input').fill('Strawberries');
        await page.keyboard.press('Enter');
        // Wait for event to fire
        await expect(page.locator('#cellAfterEdit')).toHaveValue('cellAfterEdit');

        // ColumnOptions
        const weightCell = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        await weightCell.dblclick({ force: true });
        await weightCell.locator('input').clear();
        await weightCell.locator('input').fill('4');

        await expect(page.locator('#cellAfterEdit')).toHaveValue('cellAfterEdit');
    });

    test('Resize column event', async ({ page }) => {
        // ColumnDefaults
        const resizer = page.locator('th[data-column-id="product"] > .hcg-column-resizer');
        const box = await resizer.boundingBox();
        if (box) {
            await page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(300, 300);
            await page.mouse.up();
        }
        await expect(page.locator('#columnResizing')).toHaveValue('columnResizing');

        // ColumnOptions
        const weightResizer = page.locator('th[data-column-id="weight"] > .hcg-column-resizer');
        const weightBox = await weightResizer.boundingBox();
        if (weightBox) {
            await page.mouse.move(
                weightBox.x + weightBox.width / 2,
                weightBox.y + weightBox.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(300, 300);
            await page.mouse.up();
        }
        await expect(page.locator('#columnResizing')).toHaveValue('columnResizingColumnOption');
    });

    test('Sorting column event', async ({ page }) => {
        // ColumnDefaults
        await page.locator('th[data-column-id="product"]').first().click({ force: true });
        await expect(page.locator('#beforeColumnSorting')).toHaveValue('beforeSort');
        await expect(page.locator('#headerClick')).toHaveValue('headerClick');
        await expect(page.locator('#afterColumnSorting')).toHaveValue('afterSort');

        // ColumnOptions
        await page.locator('th[data-column-id="weight"]').first().click({ force: true });
        await expect(page.locator('#beforeColumnSorting')).toHaveValue('beforeSortColumnOption');
        await expect(page.locator('#headerClick')).toHaveValue('headerClickColumnOption');
        await expect(page.locator('#afterColumnSorting')).toHaveValue('afterSortColumnOption');
    });

    test('Header click event fires when clicking on toolbar icons', async ({ page }) => {
        // Reset headerClick to verify the event fires
        await page.locator('#headerClick').fill('');

        // Click on the sort icon (not the header text) - header.events.click should fire
        const sortIcon = page.locator(
            'th[data-column-id="product"] .hcg-header-cell-icons button'
        ).first();
        await sortIcon.click({ force: true });

        await expect(page.locator('#headerClick')).toHaveValue('headerClick');
    });

    test('Filtering column event', async ({ page }) => {
        // ColumnDefaults
        const productInput = page.locator('th[data-column-id="product"] input').first();
        await productInput.click();
        await productInput.type('Apples');
        // Verify the input was filled
        await expect(productInput).toHaveValue('Apples');
        await expect(page.locator('#beforeColumnFiltering')).toHaveValue('beforeFilter');
        await expect(page.locator('#afterColumnFiltering')).toHaveValue('afterFilter');

        // ColumnOptions
        const weightInput = page.locator('th[data-column-id="weight"] input').first();
        await weightInput.click(); // Focus input first, like in filtering.spec.ts
        await weightInput.type('100');
        // Verify the input was filled
        await expect(weightInput).toHaveValue('100');
        await expect(page.locator('#beforeColumnFiltering')).toHaveValue('beforeFilterColumnOption');
        await expect(page.locator('#afterColumnFiltering')).toHaveValue('afterFilterColumnOption');
    });
});

