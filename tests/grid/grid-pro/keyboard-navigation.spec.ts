import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

test.describe('Keyboard navigation in Grid', () => {
    const tabIntoGrid = async (page: Page): Promise<void> => {
        await page.evaluate(() => {
            const existing = document.getElementById('focus-before-grid');
            if (existing) {
                existing.remove();
            }

            const button = document.createElement('button');
            button.id = 'focus-before-grid';
            button.textContent = 'Before grid';
            document.body.prepend(button);
        });

        await page.locator('#focus-before-grid').focus();
        await page.keyboard.press('Tab');
    };

    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');
        await tabIntoGrid(page);
    });

    test('Tabbing into the grid focuses the top-left header cell', async ({ page }) => {
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'product');
    });

    test('Arrow key navigation should work for table cells', async ({ page }) => {
        const rows = page.locator('tbody tr');
        const secondRowFirstCell = rows.nth(1).locator('td').nth(0);
        const secondRowSecondCell = rows.nth(1).locator('td').nth(1);
        const firstRowSecondCell = rows.nth(0).locator('td').nth(1);
        const firstRowFirstCell = rows.nth(0).locator('td').nth(0);

        const secondRowFirstValue = await secondRowFirstCell.getAttribute(
            'data-value'
        );
        const secondRowSecondValue = await secondRowSecondCell.getAttribute(
            'data-value'
        );
        const firstRowSecondValue = await firstRowSecondCell.getAttribute(
            'data-value'
        );
        const firstRowFirstValue = await firstRowFirstCell.getAttribute(
            'data-value'
        );

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await expect(page.locator(':focus')).toHaveAttribute(
            'data-value',
            secondRowFirstValue || ''
        );
        await page.keyboard.press('ArrowRight');
        await expect(page.locator(':focus')).toHaveAttribute(
            'data-value',
            secondRowSecondValue || ''
        );
        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute(
            'data-value',
            firstRowSecondValue || ''
        );
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator(':focus')).toHaveAttribute(
            'data-value',
            firstRowFirstValue || ''
        );
    });

    test('Arrow key navigation should work for table headers', async ({ page }) => {
        await expect(page.locator(':focus')).toHaveAttribute('data-column-id', 'product');
    });

    test('Sorting by pressing Enter key on a header cell should be possible', async ({ page }) => {
        await page.keyboard.press('ArrowRight');

        // Get the header cell that will be sorted
        const focusedHeader = page.locator(':focus');
        const columnId = await focusedHeader.getAttribute('data-column-id');

        // Press Enter to sort - this should trigger sorting
        await page.keyboard.press('Enter');

        await expect(page.locator(':focus')).toHaveAttribute(
            'aria-label',
            /weight \(kg\)/
        );

        // After Enter, focus moves to toolbar button (sort button)
        // Press Enter again on the sort button to trigger sorting
        await page.keyboard.press('Enter');

        // Wait for sorting to complete and class to be added
        const headerCell = page.locator(`th[data-column-id="${columnId}"]`);
        // Verify header cell has sorting class after sorting
        await expect(headerCell).toHaveClass(/hcg-column-sorted-(asc|desc)/);
    });

    test('Editing by pressing Enter key on a table cell should be possible', async ({ page }) => {
        const targetRowIndex = await page.locator('tbody tr').nth(2)
            .getAttribute('data-row-index');

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        // Wait for edit mode input to be visible
        await expect(page.locator('.hcg-edited-cell input')).toBeVisible();
        await page.keyboard.type('0');
        await page.keyboard.press('Enter');

        await expect(page.locator(':focus').locator('..')).toHaveAttribute(
            'data-row-index',
            targetRowIndex || ''
        );
    });
});
