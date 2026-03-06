import { test, expect } from '~/fixtures.ts';

test.describe('Keyboard navigation in Grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');
    });

    test('The first visible cell is focusable', async ({ page }) => {
        await page.locator('tbody td[data-column-id="product"]').first().focus();
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Apples');
    });

    test('Arrow key navigation should work for table cells', async ({ page }) => {
        await page.locator('tbody td[data-column-id="weight"]').first().focus();
        await page.keyboard.press('ArrowDown');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '40');
        await page.keyboard.press('ArrowRight');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '2.53');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '40');
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '100');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Apples');
    });

    test('Arrow key navigation should work for table headers', async ({ page }) => {
        await page.locator('tbody td[data-column-id="weight"]').first().focus();
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'weight');
    });

    test('Tab should enter the grid through the first header cell', async ({ page }) => {
        await page.evaluate(() => {
            const before = document.createElement('button');
            before.id = 'before-grid';
            before.textContent = 'Before grid';
            document.body.prepend(before);
        });

        await page.locator('#before-grid').focus();
        await page.keyboard.press('Tab');

        await expect(page.locator(':focus')).toHaveAttribute('role', 'columnheader');
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'product');
    });

    test('ArrowDown from a focused header should move focus into the table body', async ({ page }) => {
        await page.locator('tbody td[data-column-id="weight"]').first().focus();
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'weight');

        await page.keyboard.press('ArrowDown');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '100');
    });

    test('Sorting by pressing Enter key on a header cell should be possible', async ({ page }) => {
        await page.locator('tbody td[data-column-id="weight"]').first().focus();
        // Navigate to header cell
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowRight');
        
        // Get the header cell that will be sorted
        const focusedHeader = page.locator(':focus');
        const columnId = await focusedHeader.getAttribute('data-column-id');
        
        // Press Enter to sort - this should trigger sorting
        await page.keyboard.press('Enter');
        
        // After Enter, focus moves to toolbar button (sort button)
        // Press Enter again on the sort button to trigger sorting
        await page.keyboard.press('Enter');
        
        // Wait for sorting to complete and class to be added
        const headerCell = page.locator(`thead th[data-column-id="${columnId}"][id]`);
        // Verify header cell has sorting class after sorting
        await expect(headerCell).toHaveClass(/hcg-column-sorted/);
    });

    test('Editing by pressing Enter key on a table cell should be possible', async ({ page }) => {
        await page.locator('tbody td[data-column-id="weight"]').first().focus();

        await page.keyboard.press('Enter');
        
        // Wait for edit mode input to be visible
        await expect(page.locator('.hcg-edited-cell input')).toBeVisible();
        await page.keyboard.type('0');
        await page.keyboard.press('Enter');

        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'weight');
    });
});
