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
        await page.goto('/grid-pro/e2e/cell-editing', { waitUntil: 'networkidle' });
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
        await editGridCell(page, 8, 'numbers', '');

        const notificationTop = page.locator('.hcg-notification-error').first();
        await expect(notificationTop).toBeVisible();
        const topPosition = await notificationTop.evaluate(
            (el: HTMLElement) => {
                return el.getBoundingClientRect().top;
            }
        );

        expect(topPosition).toBeLessThan(200);

        await editGridCell(page, 8, 'numbers', '4');
    });

    test('Custom rule', async ({ page }) => {
        await editGridCell(page, 2, 'icon', '');

        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('empty'); // First rule
        await expect(notification).toContainText('The value must contain "URL"'); // Custom rule

        // Two messages, so one separator between them
        await expect(notification.locator('br')).toHaveCount(1);
    });

    test('Lang support', async ({ page }) => {
        await editGridCell(page, 2, 'product', '');

        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('New value'); // Lang rule
    });

    test('In case of wrong renderer type or dataType, it should default to string', async ({ page }) => {
        await expect(page.locator('tr[data-row-index="2"] td[data-column-id="wrongName"]')).toBeVisible();
    });

    test('Case unique validation', async ({ page }) => {
        // Act
        await editGridCell(page, 1, 'product', 'apples');

        // Assert
        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('Value must be unique within this column (case-insensitive).');

        // Act
        await editGridCell(page, 1, 'product', 'Red Apples');

        // Assert
        await expect(page.locator('.hcg-notification-error')).toBeHidden();
    });

    test('Case unique validation with no changes in value', async ({ page }) => {
        // Act
        await editGridCell(page, 0, 'product', 'apples');

        // Assert
        await expect(page.locator('.hcg-notification-error')).toBeHidden();

        // Act
        await editGridCell(page, 1, 'product', 'Apples');

        // Assert
        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('Value must be unique within this column (case-insensitive).');
    });
});

test.describe('Grid Pro - notification escaping', () => {
    test('Notifications are rendered as text, not markup', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                    <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css">
                </head>
                <body><div id="container"></div></body>
            </html>
        `, { waitUntil: 'networkidle' });

        await page.evaluate(() => {
            (window as any).Grid.grid('container', {
                data: { columns: { product: ['Apples'] } },
                columnDefaults: {
                    cells: { editMode: { enabled: true } }
                },
                columns: [{
                    id: 'product',
                    dataType: 'string',
                    cells: {
                        editMode: {
                            validationRules: [{
                                validate: (): boolean => false,
                                notification: function (
                                    { rawValue }: { rawValue: string }
                                ): string {
                                    return 'Bad: ' + rawValue;
                                }
                            }]
                        }
                    }
                }]
            });
        });

        const cell = page.locator('td[data-column-id="product"]').first();
        await cell.dblclick();
        const input = cell.locator('input').first();
        await input.clear();
        await input.fill('<img src=x onerror="window.__x=1"><b>B</b>');
        await page.keyboard.press('Enter');

        const notification = page.locator('.hcg-notification-error').first();
        await expect(notification).toBeVisible();
        await expect(notification).toContainText('<b>B</b>');
        await expect(notification.locator('img')).toHaveCount(0);
        await expect(notification.locator('b')).toHaveCount(0);
        expect(await page.evaluate(() => (window as any).__x)).toBeUndefined();
    });
});
