import { test, expect } from '~/fixtures.ts';

test.describe('Keyboard navigation in Grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');
        await page.locator('td').first().focus();
    });

    test('The first visible cell is focusable', async ({ page }) => {
        // await page.locator('td').first().focus();
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Apples');
    });

    test('Arrow key navigation should work for table cells', async ({ page }) => {
        // await page.locator('td').first().focus();
        await page.keyboard.press('ArrowDown');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Pears');
        await page.keyboard.press('ArrowRight');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '40');
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', '100');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Apples');
    });

    test('Arrow key navigation should work for table headers', async ({ page }) => {
        // await page.locator('td').first().focus();
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'product');
    });

    test('Sorting by pressing Enter key on a header cell should be possible', async ({ page }) => {
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
        const headerCell = page.locator(`th[data-column-id="${columnId}"]`);
        // Verify header cell has sorting class after sorting
        await expect(headerCell).toHaveClass(/hcg-column-sorted/);
    });

    test('Editing by pressing Enter key on a table cell should be possible', async ({ page }) => {

        // const cell = page.locator('td').first();
        // await cell.focus();
        
        // Navigate: Escape, ArrowDown, ArrowDown, Enter (to edit), type '0', Enter (to save)
        await page.keyboard.press('Escape');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        // Wait for edit mode input to be visible
        await expect(page.locator('.hcg-edited-cell input')).toBeVisible();
        await page.keyboard.type('0');
        await page.keyboard.press('Enter');

        await expect(page.locator(':focus').locator('..')).toHaveAttribute('data-row-index', '2');
    });
});

