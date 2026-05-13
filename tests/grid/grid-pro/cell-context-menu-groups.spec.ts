import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro cell context menu groups', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 900, height: 500 });
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        await page.waitForFunction(() => (
            typeof (window as any).Grid !== 'undefined' &&
            (window as any).Grid.grids &&
            (window as any).Grid.grids.length > 0
        ), { timeout: 10000 });
    });

    test('pinning only renders flat items (no submenu wrapper)', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('cm-groups-pin')?.remove();
            const container = document.createElement('div');
            container.id = 'cm-groups-pin';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['ROW-001'],
                        value: [1]
                    }
                },
                rendering: {
                    rows: {
                        pinning: { idColumn: 'id' }
                    }
                }
            });
        });

        const cell = page.locator(
            '#cm-groups-pin tbody tr[data-row-index="0"] td[data-column-id="id"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await expect(popup).toContainText('Pin row to top');
        await expect(popup).not.toContainText('Pinning');
    });

    test('pinning + editing renders two submenu sections', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('cm-groups-both')?.remove();
            const container = document.createElement('div');
            container.id = 'cm-groups-both';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['ROW-001', 'ROW-002'],
                        value: [1, 2]
                    }
                },
                rendering: {
                    rows: {
                        pinning: { idColumn: 'id' }
                    }
                },
                columnDefaults: {
                    cells: {
                        editMode: { enabled: true }
                    }
                }
            });
        });

        const cell = page.locator(
            '#cm-groups-both tbody tr[data-row-index="0"] td[data-column-id="value"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await expect(popup).toContainText('Pinning');
        await expect(popup).toContainText('Rows');
        await expect(popup).toContainText('Columns');
        await expect(popup).not.toContainText('Pin row to top');
    });

    test('items referencing group ids expand inline', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('cm-groups-custom')?.remove();
            const container = document.createElement('div');
            container.id = 'cm-groups-custom';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['ROW-001', 'ROW-002'],
                        value: [1, 2]
                    }
                },
                rendering: {
                    rows: {
                        pinning: { idColumn: 'id' }
                    }
                },
                columnDefaults: {
                    cells: {
                        editMode: { enabled: true },
                        contextMenu: {
                            enabled: true,
                            items: ['pinning', 'rows']
                        }
                    }
                }
            });
        });

        const cell = page.locator(
            '#cm-groups-custom tbody tr[data-row-index="0"] td[data-column-id="value"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await expect(popup).toContainText('Pin row to top');
        await expect(popup).toContainText('Add row above');
        await expect(popup).not.toContainText('Pinning');
        await expect(popup).not.toContainText('Rows');
    });

    test('inactive referenced group contributes nothing', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('cm-groups-inactive')?.remove();
            const container = document.createElement('div');
            container.id = 'cm-groups-inactive';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['ROW-001'],
                        value: [1]
                    }
                },
                columnDefaults: {
                    cells: {
                        contextMenu: {
                            enabled: true,
                            items: ['rows']
                        }
                    }
                }
            });
        });

        const cell = page.locator(
            '#cm-groups-inactive tbody tr[data-row-index="0"] td[data-column-id="id"]'
        );
        await cell.click({ button: 'right' });

        await expect(page.locator('.hcg-popup')).toHaveCount(0);
    });
});
