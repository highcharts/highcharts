import { test, expect } from '~/fixtures.ts';

test.describe('Screen reader sections', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/demo/general', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Before-Grid screen reader section should be rendered', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                lang: {
                    accessibility: {
                        screenReaderSection: {
                            beforeRegionLabel: 'Before Grid information.'
                        }
                    }
                }
            });
        });

        const beforeRegion = page.locator('[id^="grid-screen-reader-region-before-"]');
        await expect(beforeRegion).toHaveCount(1); // Element exists in DOM
        await expect(beforeRegion).toHaveAttribute('role', 'region');
        await expect(beforeRegion).toHaveAttribute('aria-label');
    });

    test('Before-Grid section should contain visually hidden content', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                lang: {
                    accessibility: {
                        screenReaderSection: {
                            beforeRegionLabel: 'Before Grid information.'
                        }
                    }
                }
            });
        });

        await expect(page.locator('[id^="grid-screen-reader-region-before-"] .hcg-visually-hidden')).toBeVisible();
    });

    test('After-Grid screen reader section should be rendered', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                lang: {
                    accessibility: {
                        screenReaderSection: {
                            afterRegionLabel: 'After Grid information.'
                        }
                    }
                }
            });
        });

        const afterRegion = page.locator('[id^="grid-screen-reader-region-after-"]');
        await expect(afterRegion).toHaveCount(1); // Element exists in DOM
        await expect(afterRegion).toHaveAttribute('role', 'region');
        await expect(afterRegion).toHaveAttribute('aria-label');
    });

    test('After-Grid section should contain visually hidden content', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                lang: {
                    accessibility: {
                        screenReaderSection: {
                            afterRegionLabel: 'After Grid information.'
                        }
                    }
                }
            });
        });

        await expect(page.locator('[id^="grid-screen-reader-region-after-"] .hcg-visually-hidden')).toBeVisible();
    });

    test('Format contexts should render correctly', async ({ page }) => {
        const result = await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                accessibility: {
                    screenReaderSection: {
                        beforeGridFormat:
                            'Custom text: {rowCount} rows and {columnCount} columns'
                    }
                }
            });

            const dataTable = grid.dataTable;
            const expectedRowCount = dataTable.rowCount;
            const expectedColumnCount = dataTable.getColumnIds().length;

            return {
                rowCount: expectedRowCount,
                columnCount: expectedColumnCount
            };
        });

        const hiddenText = await page.locator('[id^="grid-screen-reader-region-before-"] .hcg-visually-hidden').textContent();
        expect(hiddenText).toContain(`Custom text: ${result.rowCount} rows and ${result.columnCount} columns`);
    });

    test('Screen reader sections should be properly destroyed', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.accessibility.destroy();
        });

        await expect(page.locator('[id^="grid-screen-reader-region-before-"]')).toBeHidden();
        await expect(page.locator('[id^="grid-screen-reader-region-after-"]')).toBeHidden();
    });
});

