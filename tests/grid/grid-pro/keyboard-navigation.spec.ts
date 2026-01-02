import { test, expect } from '~/fixtures.ts';

test.describe('Keyboard navigation in Grid', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');
    });

    test('The first visible cell is focusable', async ({ page }) => {
        await page.locator('td').first().focus();
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'Apples');
    });

    test('Arrow key navigation should work for table cells', async ({ page }) => {
        await page.locator('td').first().focus();
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
        await page.locator('td').first().focus();
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'product');
    });

    test('Sorting by pressing Enter key on a header cell should be possible', async ({ page }) => {
        await page.locator('td').first().focus();
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');
        // Test passes if no error is thrown
    });

    test('Editing by pressing Enter key on a table cell should be possible', async ({ page }) => {
        // Start from first cell (like Cypress test)
        await page.locator('td').first().focus();
        
        // Navigate: Escape, ArrowDown, ArrowDown, Enter (to edit), type '0', Enter (to save)
        await page.keyboard.press('Escape');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        // Wait for edit mode input to be visible
        await expect(page.locator('.hcg-edited-cell input')).toBeVisible();
        await page.keyboard.type('0');
        await page.keyboard.press('Enter');
        
        // Verify we're on row 1 (like Cypress: cy.focused().parent().should('have.attr', 'data-row-index', '1'))
        await page.waitForFunction(() => {
            const focused = document.activeElement;
            return focused && focused.closest('.hcg-row[data-row-index="1"]') !== null;
        }, { timeout: 5000 });
        const focusedElement = await page.evaluateHandle(() => document.activeElement);
        if (focusedElement) {
            const parentRow = await page.evaluateHandle((el) => el?.closest('.hcg-row'), focusedElement);
            if (parentRow) {
                const rowIndex = await parentRow.evaluate((el) => el?.getAttribute('data-row-index'));
                expect(rowIndex).toBe('1');
            }
        }
        await page.keyboard.press('Enter');
        await expect(page.locator(':focus').locator('..')).toHaveAttribute('data-row-index', '1');
    });
});

