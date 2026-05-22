import { test, expect } from '~/fixtures.ts';

test.describe('Pagination', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test.beforeAll(async () => {
        // Setup for all tests
    });

    test('beforePageChange / afterPageChange', async ({ page }) => {
        await page.goto('/grid-pro/e2e/pagination-events');

        // Click next page button
        await page.locator('.hcg-button[title="Next page"]').click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('1');
        await expect(page.locator('#afterPageChange')).toHaveValue('2');

        // Click previous button
        await page.locator('.hcg-button[title="Previous page"]').click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('2');
        await expect(page.locator('#afterPageChange')).toHaveValue('1');

        // Click on page number
        await page.locator('.hcg-pagination-pages .hcg-button').filter({ hasText: '3' }).click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('1');
        await expect(page.locator('#afterPageChange')).toHaveValue('3');
    });

    test('beforePageSizeChange / afterPageSizeChange', async ({ page }) => {
        await page.goto('/grid-pro/e2e/pagination-events');

        // Change page size to 20
        await page.locator('.hcg-pagination-page-size select.hcg-input').first().selectOption('20');

        // Check event logging
        await expect(page.locator('#beforePageSizeChange')).toHaveValue('22');
        await expect(page.locator('#afterPageSizeChange')).toHaveValue('20');
    });

    test('Pinning on last page keeps grid height stable', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                (window as any).Grid.grids &&
                (window as any).Grid.grids.length > 0;
        });

        const state = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const rows = Array.from({ length: 254 }, (_, i) => ({
                ID: i + 1,
                Name: `Row ${i + 1}`
            }));
            const host = document.getElementById('container');

            if (host) {
                host.style.height = '520px';
            }

            await grid.update({
                dataTable: {
                    columns: {
                        ID: rows.map((row) => row.ID),
                        Name: rows.map((row) => row.Name)
                    }
                },
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                },
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'ID'
                        }
                    }
                }
            });
            const getHeight = (element: HTMLElement | null): number =>
                Math.round(element?.getBoundingClientRect().height || 0);

            await grid.update({
                pagination: {
                    page: 26
                }
            });

            const beforePin = {
                hostHeight: getHeight(host),
                gridHeight: getHeight(grid.container),
                tableHeight: getHeight(grid.viewport.tableElement)
            };

            await grid.rowPinning.pin(250, 'top');

            return {
                beforePin,
                afterPin: {
                    hostHeight: getHeight(host),
                    gridHeight: getHeight(grid.container),
                    tableHeight: getHeight(grid.viewport.tableElement)
                }
            };
        });

        expect(state.afterPin.hostHeight).toBe(state.beforePin.hostHeight);
        expect(state.afterPin.gridHeight).toBe(state.beforePin.gridHeight);
        expect(state.afterPin.tableHeight).toBe(state.beforePin.tableHeight);
    });

    test('Pinned rows are counted in pagination page size', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        const state = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const rows = Array.from({ length: 30 }, (_, i) => ({
                ID: i,
                Name: `Row ${i}`
            }));

            await grid.update({
                dataTable: {
                    columns: {
                        ID: rows.map((row) => row.ID),
                        Name: rows.map((row) => row.Name)
                    }
                },
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                },
                rendering: {
                    rows: {
                        virtualization: false,
                        pinning: {
                            idColumn: 'ID'
                        }
                    }
                }
            });

            const getScrollableIds = (): string[] => Array.from(
                document.querySelectorAll(
                    'tbody:not(.hcg-tbody-pinned) td[data-column-id="ID"]'
                )
            ).map((el): string => (el.textContent || '').trim());

            const beforePin = {
                top: grid.viewport.rowPinningView.getRows('top').length,
                scrollable: grid.viewport.rows.length,
                bottom: grid.viewport.rowPinningView.getRows('bottom').length
            };

            await grid.rowPinning.pin(0, 'top');

            const afterTopPin = {
                top: grid.viewport.rowPinningView.getRows('top').length,
                scrollable: grid.viewport.rows.length,
                bottom: grid.viewport.rowPinningView.getRows('bottom').length,
                scrollableIds: getScrollableIds()
            };

            await grid.rowPinning.pin(1, 'bottom');

            const afterBottomPin = {
                top: grid.viewport.rowPinningView.getRows('top').length,
                scrollable: grid.viewport.rows.length,
                bottom: grid.viewport.rowPinningView.getRows('bottom').length
            };

            return {
                beforePin,
                afterTopPin,
                afterBottomPin
            };
        });

        expect(state.beforePin.top).toBe(0);
        expect(state.beforePin.scrollable).toBe(10);
        expect(state.beforePin.bottom).toBe(0);

        expect(state.afterTopPin.top).toBe(1);
        expect(state.afterTopPin.scrollable).toBe(9);
        expect(state.afterTopPin.bottom).toBe(0);
        expect(state.afterTopPin.scrollableIds).not.toContain('11');

        expect(state.afterBottomPin.top).toBe(1);
        expect(state.afterBottomPin.scrollable).toBe(8);
        expect(state.afterBottomPin.bottom).toBe(1);
    });
});
