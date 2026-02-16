import { test, expect } from '~/fixtures.ts';

test.describe('Sticky rows', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/credits', {
            waitUntil: 'networkidle'
        });

        await page.evaluate(() => {
            const doc = window.document;
            const container = doc.createElement('div');
            container.id = 'sticky-grid-container';
            container.style.width = '900px';
            container.style.height = '420px';
            doc.body.appendChild(container);

            const products = Array.from({ length: 140 }, (_, i) => {
                const index = i + 1;
                return {
                    id: 'SKU-' + String(index).padStart(3, '0'),
                    product: 'Product ' + index,
                    category: [
                        'Fruit',
                        'Vegetable',
                        'Drinks',
                        'Snacks'
                    ][index % 4],
                    stock: (index * 7) % 100,
                    price: '$' + (index * 0.35 + 1).toFixed(2)
                };
            });

            const createGrid = (overrides: Record<string, unknown> = {}) => {
                const baseOptions: Record<string, unknown> = {
                    data: {
                        providerType: 'local',
                        dataTable: {
                            columns: {
                                id: products.map(p => p.id),
                                product: products.map(p => p.product),
                                category: products.map(p => p.category),
                                stock: products.map(p => p.stock),
                                price: products.map(p => p.price)
                            }
                        }
                    },
                    rendering: {
                        rows: {
                            virtualizationThreshold: 20,
                            sticky: {
                                idColumn: 'id',
                                ids: ['SKU-005', 'SKU-050', 'SKU-135']
                            }
                        }
                    },
                    columns: [{
                        id: 'id',
                        width: 220
                    }, {
                        id: 'product',
                        width: 260
                    }, {
                        id: 'category',
                        width: 220
                    }, {
                        id: 'stock',
                        width: 220
                    }, {
                        id: 'price',
                        width: 220
                    }]
                };
                const grid = (window as any).Grid.grid(
                    'sticky-grid-container',
                    (window as any).Grid.merge(baseOptions, overrides)
                );

                (window as any).stickyRowsTestGrid = grid;
                return grid;
            };

            (window as any).stickyRowsCreateGrid = createGrid;
            createGrid();
        });

        await page.waitForFunction(() => {
            return !!((window as any).stickyRowsTestGrid?.viewport);
        });
    });

    test('keeps one tbody in the main table when sticky rows are enabled', async ({
        page
    }) => {
        const tbodyCount = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return grid.viewport.tableElement.querySelectorAll(':scope > tbody')
                .length;
        });

        expect(tbodyCount).toBe(1);
    });

    test('supports runtime stick and unstick API', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).stickyRowsTestGrid;
            await grid.stickRow?.('SKU-120');
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            return Array.from(
                vp.stickyBottomTbodyElement?.children || []
            ).some((row: any) => row.getAttribute('data-row-index') === '119');
        });

        await page.evaluate(async () => {
            const grid = (window as any).stickyRowsTestGrid;
            await grid.unstickRow?.('SKU-120');
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            return !Array.from(
                vp.stickyBottomTbodyElement?.children || []
            ).some((row: any) => row.getAttribute('data-row-index') === '119');
        });

        const stickyRows = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return grid.getStickyRows();
        });
        expect(stickyRows).not.toContain('SKU-120');
    });

    test('sticks a virtualized row that is rendered but outside viewport', async ({
        page
    }) => {
        const target = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            const rowCount = grid.dataTable.getRowCount();
            const rowHeight = vp.rowsVirtualizer.defaultRowHeight ||
                vp.rows[0]?.htmlElement.offsetHeight ||
                1;
            const targetScrollTop = rowHeight * 60;
            vp.tbodyElement.scrollTop = targetScrollTop;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));

            const visibleFrom = Math.max(
                0,
                Math.floor(vp.tbodyElement.scrollTop / rowHeight)
            );
            const excluded = new Set(
                (grid.getStickyRows() || []).map(
                    (id: string | number) => String(id)
                )
            );

            for (const row of vp.rows) {
                const id = String(row.data.id || '');
                const aboveVisibleWindow = (
                    row.index < visibleFrom &&
                    row.index > 0 &&
                    row.index < rowCount - 1 &&
                    id &&
                    !excluded.has(id)
                );

                if (aboveVisibleWindow) {
                    return {
                        index: row.index,
                        id
                    };
                }
            }

            return {
                index: -1,
                id: ''
            };
        });

        expect(target.index).toBeGreaterThan(-1);
        expect(target.id).not.toBe('');

        await page.evaluate(async ({ id }) => {
            const grid = (window as any).stickyRowsTestGrid;
            await grid.stickRow(id);
        }, target);

        await page.waitForFunction((rowId) => {
            const grid = (window as any).stickyRowsTestGrid;
            return grid.getStickyRows().includes(rowId);
        }, target.id);

        await page.waitForFunction((index) => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            const isStickyTop = Array.from(
                vp.stickyTopTbodyElement?.children || []
            ).some((row: any) => row.getAttribute('data-row-index') === String(index));

            return isStickyTop;
        }, target.index);
    });

    test('sticks a row below viewport into bottom sticky', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 0;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
            await grid.stickRow('SKU-120');
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            return Array.from(vp.stickyBottomTbodyElement?.children || []).some(
                (row: any) => row.getAttribute('data-row-index') === '119'
            );
        });

        const stickyRows = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return grid.getStickyRows();
        });
        expect(stickyRows).toContain('SKU-120');
    });

    test('renders adjacent sticky pairs together on top and bottom', async ({
        page
    }) => {
        await page.evaluate(async () => {
            const grid = (window as any).stickyRowsTestGrid;
            await grid.stickRow('SKU-006');
            await grid.stickRow('SKU-136');
        });

        await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 6000;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            const topIndexes = Array.from(
                vp.stickyTopTbodyElement?.children || []
            ).map((row: any) => row.getAttribute('data-row-index'));

            return topIndexes.includes('4') && topIndexes.includes('5');
        });

        const topIndexes = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;

            return Array.from(vp.stickyTopTbodyElement?.children || []).map(
                (row: any) => row.getAttribute('data-row-index')
            );
        });
        expect(topIndexes).toContain('4');
        expect(topIndexes).toContain('5');

        await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 0;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            const bottomIndexes = Array.from(
                vp.stickyBottomTbodyElement?.children || []
            ).map((row: any) => row.getAttribute('data-row-index'));

            return bottomIndexes.includes('134') && bottomIndexes.includes('135');
        });

        const bottomIndexes = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;

            return Array.from(vp.stickyBottomTbodyElement?.children || []).map(
                (row: any) => row.getAttribute('data-row-index')
            );
        });
        expect(bottomIndexes).toContain('134');
        expect(bottomIndexes).toContain('135');
    });

    test('works with virtualization disabled', async ({ page }) => {
        await page.evaluate(() => {
            const createGrid = (window as any).stickyRowsCreateGrid;
            createGrid({
                rendering: {
                    rows: {
                        virtualization: false,
                        sticky: {
                            idColumn: 'id',
                            ids: ['SKU-060']
                        }
                    }
                }
            });
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return !!grid?.viewport;
        });

        await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 6000;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            return Array.from(vp.stickyTopTbodyElement?.children || []).some(
                (row: any) => row.getAttribute('data-row-index') === '59'
            );
        });

        const state = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return !!grid.viewport.virtualRows;
        });
        expect(state).toBe(false);
    });

    test('keeps sticky behavior across virtualization threshold mode toggle', async ({
        page
    }) => {
        await page.evaluate(() => {
            const createGrid = (window as any).stickyRowsCreateGrid;
            createGrid({
                rendering: {
                    rows: {
                        virtualizationThreshold: 200,
                        sticky: {
                            idColumn: 'id',
                            ids: ['SKU-060']
                        }
                    }
                }
            });
        });

        await page.waitForFunction(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return !!grid?.viewport;
        });

        const initialMode = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            return !!grid.viewport.virtualRows;
        });

        await page.evaluate(async () => {
            const grid = (window as any).stickyRowsTestGrid;
            await grid.update({
                rendering: {
                    rows: {
                        virtualizationThreshold: 20
                    }
                }
            });
            await grid.stickRow('SKU-060');
        });

        const toggledState = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 3400;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));

            return {
                isVirtualized: !!vp.virtualRows,
                stickyRows: grid.getStickyRows ? grid.getStickyRows() : []
            };
        });

        expect(initialMode).toBe(false);
        expect(toggledState.isVirtualized).toBe(true);
        expect(toggledState.stickyRows).toContain('SKU-060');
    });

    test('syncs sticky overlay horizontally with body scroll', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            vp.tbodyElement.scrollTop = 1800;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
            vp.tbodyElement.scrollLeft = 240;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));
        });

        const transforms = await page.evaluate(() => {
            const grid = (window as any).stickyRowsTestGrid;
            const vp = grid.viewport;
            return {
                bodyScrollLeft: vp.tbodyElement.scrollLeft,
                topTransform: (
                    vp.stickyTopContainer?.firstElementChild as HTMLElement
                )?.style.transform || '',
                bottomTransform: (
                    vp.stickyBottomContainer?.firstElementChild as HTMLElement
                )?.style.transform || ''
            };
        });

        expect(transforms.bodyScrollLeft).toBeGreaterThan(0);
        expect(transforms.topTransform).toContain('translateX(-');
        expect(transforms.bottomTransform).toContain('translateX(-');
    });
});
