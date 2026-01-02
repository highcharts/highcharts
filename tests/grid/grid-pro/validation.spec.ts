import { test, expect } from '~/fixtures.ts';

// Helper function to edit grid cell
async function editGridCell(
    page: any,
    rowIndex: number,
    columnId: string,
    value: string
) {
    const cell = page.locator(`tr[data-row-index="${rowIndex}"] td[data-column-id="${columnId}"]`);
    await cell.dblclick();
    const input = cell.locator('input').first();
    await input.clear();
    if (value) {
        await input.fill(value);
        await page.keyboard.press('Enter');
    } else {
        await page.keyboard.press('Enter');
    }
}

test.describe('Grid Pro - validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/cypress/cell-editing', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Notification position', async ({ page }) => {
        // Bottom position
        await editGridCell(page, 2, 'numbers', '');

        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        const top = await notification.evaluate((el: HTMLElement) => {
            return el.getBoundingClientRect().top;
        });
        expect(top).toBeGreaterThan(200);

        await editGridCell(page, 2, 'numbers', '4');

        // Top position
        await editGridCell(page, 2, 'numbers', '');

        const notificationTop = page.locator('.hcg-notification-error').first();
        await expect(notificationTop).toBeVisible();
        const topPosition = await notificationTop.evaluate((el: HTMLElement) => {
            return el.getBoundingClientRect().top;
        });
        expect(topPosition).toBeLessThan(200);

        await editGridCell(page, 2, 'numbers', '4');
    });

    test('Custom rule', async ({ page }) => {
        await editGridCell(page, 2, 'icon', '');

        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('empty'); // First rule
        await expect(notification).toContainText('The value must contain "URL"'); // Custom rule
    });

    test('Lang support', async ({ page }) => {
        await editGridCell(page, 2, 'product', '');

        await expect(page.locator('.hcg-notification-error').first())
            .toBeVisible()
            .toContainText('New value'); // Lang rule
    });

    test('In case of wrong renderer type or dataType, it should default to string', async ({ page }) => {
        await expect(page.locator('tr[data-row-index="2"] td[data-column-id="wrongName"]')).toBeVisible();
    });

    test('Case unique validation', async ({ page }) => {
        // Act
        await editGridCell(page, 1, 'product', 'apples');

        // Assert
        await expect(page.locator('.hcg-notification-error').first())
            .toBeVisible()
            .toContainText('Value must be unique within this column (case-insensitive).');

        // Act
        await editGridCell(page, 1, 'product', 'Red Apples');

        // Assert
        await expect(page.locator('.hcg-notification-error')).not.toBeVisible();
    });

    test('Case unique validation with no changes in value', async ({ page }) => {
        // Act
        await editGridCell(page, 0, 'product', 'apples');

        // Assert
        await expect(page.locator('.hcg-notification-error')).not.toBeVisible();

        // Act
        await editGridCell(page, 1, 'product', 'Apples');

        // Assert
        await expect(page.locator('.hcg-notification-error').first())
            .toBeVisible()
            .toContainText('Value must be unique within this column (case-insensitive).');
    });
});

