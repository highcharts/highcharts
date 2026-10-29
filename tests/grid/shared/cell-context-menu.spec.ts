import { test, expect } from '~/fixtures.ts';

const cases = [
    {
        name: 'Grid Lite',
        url: '/grid-lite/e2e/cell-context-menu'
    }
];

test.describe('Cell Context Menu', () => {
    for (const c of cases) {
        test.describe(`${c.name}`, () => {
            test.beforeEach(async ({ page }) => {
                await page.setViewportSize({ width: 900, height: 500 });
                await page.goto(c.url, { waitUntil: 'networkidle' });

                await page.waitForFunction(() => {
                    return typeof (window as any).Grid !== 'undefined' &&
                        (window as any).Grid.grids &&
                        (window as any).Grid.grids.length > 0;
                }, { timeout: 10000 });

                await page.waitForFunction(() => {
                    return document.querySelectorAll('tbody td').length > 0;
                }, { timeout: 10000 });
            });

            test('Right-click shows menu and item callback gets context', async ({ page }) => {
                const productCell = page.locator(
                    'tbody tr[data-row-index="1"] td[data-column-id="product"]'
                );

                await expect(productCell).toBeVisible();
                await expect(productCell).toHaveText(/.+/);

                const row = productCell.locator('xpath=ancestor::tr[1]');
                await expect(row).toHaveAttribute('data-row-index', /.+/);

                const rowIndex = await row.getAttribute('data-row-index');
                const value = ((await productCell.textContent()) ?? '').trim();
                const expected = rowIndex + '|product|' + value;

                await productCell.click({ button: 'right' });

                const popup = page.locator('.hcg-popup');
                await expect(popup).toBeVisible();
                await expect(popup).toContainText('Show context');

                await page.locator('.hcg-menu-item', { hasText: 'Show context' }).click();

                await expect(page.locator('#cellContextMenuResult')).toHaveValue(expected);
                await expect(popup).toBeHidden();
            });

        });
    }

    test.describe('Grid Pro', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 900, height: 500 });
            await page.goto('/grid-pro/basic/overview', {
                waitUntil: 'networkidle'
            });

            await page.waitForFunction(() => {
                return typeof (window as any).Grid !== 'undefined' &&
                    (window as any).Grid.grids &&
                    (window as any).Grid.grids.length > 0;
            }, { timeout: 10000 });
        });

        test(
            'No contextMenu config and no pinning keeps native context menu',
            async ({ page }) => {
                await page.evaluate(() => {
                    const existing = document.getElementById('cm-auto-off');
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-auto-off';
                    document.body.appendChild(container);

                    (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-auto-off tbody tr[data-row-index="0"] td[data-column-id="id"]'
                );
                await cell.click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toHaveCount(0);
            }
        );

        test(
            'Legacy pinning config without enabled keeps native context menu',
            async ({ page }) => {
                await page.evaluate(() => {
                    const existing = document.getElementById(
                        'cm-auto-pinning-config'
                    );
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-auto-pinning-config';
                    document.body.appendChild(container);

                    (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            },
                            idColumn: 'id'
                        },
                        rendering: {
                            rows: {
                                // Legacy config must not enable UI.
                                pinning: {}
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-auto-pinning-config tbody tr[data-row-index="0"] td[data-column-id="id"]'
                );
                await cell.click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toHaveCount(0);
            }
        );

        test(
            'No contextMenu config with enabled pinning shows defaults',
            async ({ page }) => {
                await page.evaluate(() => {
                    const existing = document.getElementById('cm-auto-on');
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-auto-on';
                    document.body.appendChild(container);

                    (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            },
                            idColumn: 'id'
                        },
                        rendering: {
                            rows: {
                                pinning: {
                                    enabled: true
                                }
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-auto-on tbody tr[data-row-index="0"] td[data-column-id="id"]'
                );
                await cell.click({ button: 'right' });

                const popup = page.locator('.hcg-popup').last();
                await expect(popup).toContainText('Pin row to top');
                await expect(popup).toContainText('Pin row to bottom');
                await expect(popup).toContainText('Unpin row');
            }
        );

        test(
            'Deprecated row pinning lang keys customize built-in labels',
            async ({ page }) => {
                await page.evaluate(() => {
                    const existing = document.getElementById(
                        'cm-legacy-pinning-lang'
                    );
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-legacy-pinning-lang';
                    document.body.appendChild(container);

                    (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            },
                            idColumn: 'id'
                        },
                        lang: {
                            pinRowTop: 'Legacy pin top',
                            pinRowBottom: 'Legacy pin bottom',
                            unpinRow: 'Legacy unpin'
                        },
                        rendering: {
                            rows: {
                                pinning: {
                                    enabled: true
                                }
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-legacy-pinning-lang tbody tr[data-row-index="0"] td[data-column-id="id"]'
                );
                await cell.click({ button: 'right' });

                const popup = page.locator('.hcg-popup').last();
                await expect(popup).toContainText('Legacy pin top');
                await expect(popup).toContainText('Legacy pin bottom');
                await expect(popup).toContainText('Legacy unpin');
            }
        );

        test('Auto mode reacts to runtime pinning enabled updates', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-auto-runtime');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-auto-runtime';
                document.body.appendChild(container);

                (window as any).cmAutoRuntimeGrid = (window as any).Grid.grid(
                    container,
                    {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            },
                            idColumn: 'id'
                        }
                    }
                );
            });

            const cell = page.locator(
                '#cm-auto-runtime tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );

            await cell.click({ button: 'right' });
            await expect(page.locator('.hcg-popup')).toHaveCount(0);

            await page.evaluate(async () => {
                await (window as any).cmAutoRuntimeGrid.update({
                    rendering: {
                        rows: {
                            // Legacy config must not enable UI.
                            pinning: {}
                        }
                    }
                });
            });

            await cell.click({ button: 'right' });
            await expect(page.locator('.hcg-popup')).toHaveCount(0);

            await page.evaluate(async () => {
                await (window as any).cmAutoRuntimeGrid.update({
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: true
                            }
                        }
                    }
                });
            });

            await cell.click({ button: 'right' });
            const popup = page.locator('.hcg-popup').last();
            await expect(popup).toContainText('Pin row to top');

            await popup.press('Escape');
            await expect(popup).toBeHidden();

            await page.evaluate(async () => {
                await (window as any).cmAutoRuntimeGrid.update({
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: false
                            }
                        }
                    }
                });
            });

            await cell.click({ button: 'right' });
            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('Default menu renders multiple active groups as submenus', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-default-groups'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-default-groups';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        idColumn: 'id',
                        columns: {
                            id: ['ROW-001'],
                            product: ['Apples']
                        }
                    },
                    tableEditing: {
                        enabled: true
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: true
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-default-groups tbody tr[data-row-index="0"] td[data-column-id="product"]'
            );
            await cell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            const rootItems = popup.locator('.hcg-menu-item');

            await expect(rootItems).toHaveCount(3);
            await expect(rootItems.nth(0)).toContainText('Row pinning');
            await expect(rootItems.nth(1)).toContainText('Rows');
            await expect(rootItems.nth(2)).toContainText('Columns');
            await expect(popup).not.toContainText('Add row above');

            await rootItems.nth(1).click();
            await expect(page.locator('.hcg-popup')).toHaveCount(2);
            await expect(page.locator('.hcg-popup').last())
                .toContainText('Add row above');
        });

        test('Explicit built-in groups expand inline', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-inline-groups'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-inline-groups';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            product: ['Apples'],
                            stock: [10]
                        }
                    },
                    tableEditing: {
                        enabled: true
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                items: ['rows', 'columns']
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-inline-groups tbody tr[data-row-index="0"] td[data-column-id="product"]'
            );
            await cell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            const menuItems = popup.locator('.hcg-menu-item');

            await expect(menuItems).toHaveCount(6);
            await expect(popup).toContainText('Add row above');
            await expect(popup).toContainText('Add column before');
            await expect(menuItems.first()).not.toContainText('Rows');
        });

        test('Table editing context menu actions add and delete rows', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-edit-rows');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-edit-rows';
                document.body.appendChild(container);

                (window as any).cmEditRowsGrid = (window as any).Grid.grid(
                    container,
                    {
                        data: {
                            idColumn: 'id',
                            columns: {
                                id: ['row1', 'row2', 'row3'],
                                product: ['Apples', 'Pears', 'Plums'],
                                stock: [10, 20, 30]
                            }
                        },
                        tableEditing: {
                            enabled: true
                        },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    items: ['addRowAbove', 'deleteRow']
                                }
                            }
                        }
                    }
                );
            });

            const secondProductCell = page.locator(
                '#cm-edit-rows tbody tr[data-row-index="1"] td[data-column-id="product"]'
            );
            await secondProductCell.click({ button: 'right' });
            await page.locator('.hcg-menu-item', { hasText: 'Add row above' })
                .last()
                .click();

            await expect(page.locator('#cm-edit-rows tbody tr')).toHaveCount(4);

            let state = await page.evaluate(() => {
                const table = (window as any).cmEditRowsGrid
                    .dataProvider
                    .getDataTable();

                return {
                    rowCount: table.getRowCount(),
                    row: table.getRow(1, ['id', 'product', 'stock'])
                };
            });

            expect(state).toEqual({
                rowCount: 4,
                row: ['row4', null, null]
            });

            const insertedProductCell = page.locator(
                '#cm-edit-rows tbody tr[data-row-index="1"] td[data-column-id="product"]'
            );
            await insertedProductCell.click({ button: 'right' });
            await page.locator('.hcg-menu-item', { hasText: 'Delete row' })
                .last()
                .click();

            await expect(page.locator('#cm-edit-rows tbody tr')).toHaveCount(3);

            state = await page.evaluate(() => {
                const table = (window as any).cmEditRowsGrid
                    .dataProvider
                    .getDataTable();

                return {
                    rowCount: table.getRowCount(),
                    ids: table.getColumn('id', true),
                    products: table.getColumn('product', true)
                };
            });

            expect(state).toEqual({
                rowCount: 3,
                ids: ['row1', 'row2', 'row3'],
                products: ['Apples', 'Pears', 'Plums']
            });
        });

        test('Table editing adds the first row from the empty table menu', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-empty-table');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-empty-table';
                document.body.appendChild(container);

                (window as any).cmEmptyTableGrid = (window as any).Grid.grid(
                    container,
                    {
                        data: {
                            idColumn: 'id',
                            columns: {
                                id: [],
                                product: []
                            }
                        },
                        tableEditing: {
                            enabled: true
                        }
                    }
                );
            });

            const body = page.locator(
                '#cm-empty-table tbody:not(.hcg-tbody-sticky)'
            );
            await expect(body).toBeVisible();
            await expect(page.locator('#cm-empty-table tbody tr'))
                .toHaveCount(0);

            await body.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            await expect(popup).toContainText('Add row');

            await page.locator('.hcg-menu-item', { hasText: 'Add row' })
                .last()
                .click();

            await expect(body.locator('tr')).toHaveCount(1);

            const state = await page.evaluate(() => {
                const table = (window as any).cmEmptyTableGrid
                    .dataProvider
                    .getDataTable();

                return {
                    rowCount: table.getRowCount(),
                    row: table.getRow(0, ['id', 'product'])
                };
            });

            expect(state).toEqual({
                rowCount: 1,
                row: ['row1', null]
            });

            // The body gives up its tab stop once it holds a cell to focus.
            await expect(body).not.toHaveAttribute('tabindex', '0');
        });

        test('Empty table menu opens with the context menu key', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-empty-keyboard');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-empty-keyboard';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            product: []
                        }
                    },
                    tableEditing: {
                        enabled: true
                    }
                });
            });

            const body = page.locator(
                '#cm-empty-keyboard tbody:not(.hcg-tbody-sticky)'
            );
            await expect(body).toHaveAttribute('tabindex', '0');

            await body.focus();
            await body.press('Shift+F10');

            await expect(page.locator('.hcg-popup').last())
                .toContainText('Add row');
        });

        test('Empty table keeps the native menu without table editing', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-empty-plain');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-empty-plain';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            product: []
                        }
                    }
                });
            });

            const body = page.locator(
                '#cm-empty-plain tbody:not(.hcg-tbody-sticky)'
            );
            await expect(body).toBeVisible();
            await body.click({ button: 'right' });

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('Empty table menu can be turned off and replaced', async ({ page }) => {
            await page.evaluate(() => {
                for (const id of ['cm-empty-off', 'cm-empty-own']) {
                    document.getElementById(id)?.remove();

                    const container = document.createElement('div');
                    container.id = id;
                    document.body.appendChild(container);

                    (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                product: []
                            }
                        },
                        rendering: {
                            table: {
                                contextMenu: id === 'cm-empty-off' ?
                                    { enabled: false } :
                                    { items: [{ label: 'Own action' }] }
                            }
                        },
                        tableEditing: {
                            enabled: true
                        }
                    });
                }
            });

            await page.locator('#cm-empty-off tbody:not(.hcg-tbody-sticky)')
                .click({ button: 'right' });

            await expect(page.locator('.hcg-popup')).toHaveCount(0);

            await page.locator('#cm-empty-own tbody:not(.hcg-tbody-sticky)')
                .click({ button: 'right' });

            await expect(page.locator('.hcg-popup').last())
                .toHaveText('Own action');
        });

        test('Table editing context menu actions add and delete columns', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-edit-columns');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-edit-columns';
                document.body.appendChild(container);

                (window as any).cmEditColumnsGrid = (window as any).Grid.grid(
                    container,
                    {
                        data: {
                            columns: {
                                product: ['Apples'],
                                stock: [10]
                            }
                        },
                        tableEditing: {
                            enabled: true
                        },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    items: [
                                        'addColumnBefore',
                                        'deleteColumn'
                                    ]
                                }
                            }
                        }
                    }
                );
            });

            const stockCell = page.locator(
                '#cm-edit-columns tbody tr[data-row-index="0"] td[data-column-id="stock"]'
            );
            await stockCell.click({ button: 'right' });
            await page.locator(
                '.hcg-menu-item',
                { hasText: 'Add column before' }
            ).last().click();

            await expect(page.locator(
                '#cm-edit-columns tbody tr[data-row-index="0"] td[data-column-id="column3"]'
            )).toBeVisible();

            let columnIds = await page.evaluate(() => {
                return (window as any).cmEditColumnsGrid
                    .dataProvider
                    .getDataTable()
                    .getColumnIds();
            });

            expect(columnIds).toEqual(['product', 'column3', 'stock']);

            const newColumnCell = page.locator(
                '#cm-edit-columns tbody tr[data-row-index="0"] td[data-column-id="column3"]'
            );
            await newColumnCell.click({ button: 'right' });
            const deleteColumnItem = page.locator(
                '.hcg-menu-item',
                { hasText: 'Delete column' }
            ).last();

            await expect(deleteColumnItem).not.toBeDisabled();

            await deleteColumnItem.click();

            columnIds = await page.evaluate(() => {
                return (window as any).cmEditColumnsGrid
                    .dataProvider
                    .getDataTable()
                    .getColumnIds();
            });

            expect(columnIds).toEqual(['product', 'stock']);

            await expect(page.locator(
                '#cm-edit-columns tbody tr[data-row-index="0"] td[data-column-id="column3"]'
            )).toHaveCount(0);
        });

        test('Context menu closes after scrolling and refreshes context', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-scroll');
                existing?.remove();
                document.getElementById('cellContextMenuResult')?.remove();

                const result = document.createElement('input');
                result.id = 'cellContextMenuResult';
                document.body.appendChild(result);

                const container = document.createElement('div');
                container.id = 'cm-scroll';
                container.style.height = '420px';
                document.body.appendChild(container);

                const rows = 200;
                const products: string[] = [];
                const weights: number[] = [];

                for (let i = 0; i < rows; ++i) {
                    products.push('Product ' + (i + 1));
                    weights.push(i + 1);
                }

                (window as any).cmScrollGrid = (window as any).Grid.grid(
                    container,
                    {
                        data: {
                            columns: {
                                product: products,
                                weight: weights
                            }
                        },
                        rendering: {
                            rows: {
                                virtualization: true
                            }
                        },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    items: [{
                                        label: 'Show context',
                                        icon: 'menu',
                                        onClick: function (cell) {
                                            const input = document
                                                .getElementById(
                                                    'cellContextMenuResult'
                                                ) as HTMLInputElement | null;

                                            if (input) {
                                                input.value =
                                                    cell.row.index + '|' +
                                                    cell.column.id + '|' +
                                                    cell.value;
                                            }
                                        }
                                    }]
                                }
                            }
                        }
                    }
                );
            });

            const initialState = await page.evaluate(() => {
                const grid = (window as any).cmScrollGrid;
                const vp = grid.viewport;
                return {
                    virtual: vp.virtualRows,
                    firstIndex: vp.rows[0]?.index ?? null,
                    rowHeight: vp.rowsVirtualizer?.defaultRowHeight ?? 24
                };
            });

            expect(initialState.virtual, 'Virtualization should be enabled for this demo.').toBe(true);
            expect(initialState.firstIndex).not.toBeNull();

            const productCell = page.locator(
                '#cm-scroll tbody tr[data-row-index="1"] td[data-column-id="product"]'
            );

            await productCell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            await expect(popup).toBeVisible();

            const initialBox = await popup.boundingBox();
            expect(initialBox, 'Popup should have a bounding box.').not.toBeNull();

            await page.evaluate((rowHeight) => {
                const grid = (window as any).cmScrollGrid;
                const vp = grid.viewport;
                const target = vp.tbodyElement;
                target.scrollTop += rowHeight * 100;
                target.dispatchEvent(new Event('scroll'));
            }, initialState.rowHeight);

            await page.waitForFunction((firstIndex: number | null) => {
                const grid = (window as any).cmScrollGrid;
                const vp = grid.viewport;
                return vp.rows[0]?.index !== firstIndex;
            }, initialState.firstIndex, { timeout: 10000 });

            await expect(popup).toBeHidden();

            const productCellAfterScroll = page.locator(
                '#cm-scroll tbody tr:first-child td[data-column-id="product"]'
            );

            await expect(productCellAfterScroll).toBeVisible();
            await expect(productCellAfterScroll).toHaveText(/.+/);

            const rowAfterScroll = productCellAfterScroll.locator(
                'xpath=ancestor::tr[1]'
            );
            await expect(rowAfterScroll).toHaveAttribute('data-row-index', /.+/);

            const rowIndexAfterScroll =
                await rowAfterScroll.getAttribute('data-row-index');
            const valueAfterScroll = ((await productCellAfterScroll.textContent()) ?? '').trim();
            const expected = rowIndexAfterScroll + '|product|' + valueAfterScroll;

            await productCellAfterScroll.click({ button: 'right' });
            await expect(popup).toBeVisible();
            await page.locator('.hcg-menu-item', { hasText: 'Show context' }).click();
            await expect(page.locator('#cellContextMenuResult')).toHaveValue(expected);
        });

        test('enabled with empty items keeps native context menu', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-builtins-empty');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-empty';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['A'],
                            value: [1]
                        },
                        idColumn: 'id'
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: true
                            }
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: []
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtins-empty tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('built-ins are hidden when row pinning UI is disabled', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-builtins-disabled'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-disabled';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        },
                        idColumn: 'id'
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: false
                            }
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtins-disabled tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('explicit built-ins are hidden when row pinning UI is disabled', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-builtins-explicit-disabled'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-explicit-disabled';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        },
                        idColumn: 'id'
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: false
                            }
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [
                                    'pinRowTop',
                                    'pinRowBottom',
                                    'unpinRow'
                                ]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtins-explicit-disabled tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('custom context menu items remain when row pinning built-ins are hidden', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-builtins-custom-disabled'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-custom-disabled';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        },
                        idColumn: 'id'
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                enabled: false
                            }
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [
                                    'pinRowTop',
                                    {
                                        label: 'Custom action',
                                        icon: 'menu'
                                    },
                                    {
                                        actionId: 'unpinRow'
                                    }
                                ]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtins-custom-disabled tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            await expect(popup).toBeVisible();

            const menuButtons = popup.locator('.hcg-menu-item');
            await expect(menuButtons).toHaveCount(1);
            await expect(menuButtons).toContainText('Custom action');
            await expect(popup).not.toContainText('Pin row to top');
            await expect(popup).not.toContainText('Pin row to bottom');
            await expect(popup).not.toContainText('Unpin row');
        });

        test('Hovering a branch opens its submenu, a leaf closes it', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-hover');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-hover';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [{
                                    label: 'Leaf'
                                }, {
                                    label: 'Branch',
                                    items: [{ label: 'First child' }]
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-hover tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const popups = page.locator('.hcg-popup');
            const root = popups.first();
            const focusedLabel = (): Promise<string> => page.evaluate(() => (
                (document.activeElement as HTMLButtonElement | null)
                    ?.innerText?.trim() || ''
            ));

            expect(await focusedLabel()).toContain('Leaf');

            await root.locator('.hcg-menu-item', { hasText: 'Branch' })
                .hover();

            await expect(popups).toHaveCount(2);
            await expect(popups.last()).toContainText('First child');

            // The pointer opens the submenu without taking the keyboard
            // along, so the focus stays where it was.
            expect(await focusedLabel()).toContain('Leaf');

            await root.locator('.hcg-menu-item', { hasText: 'Leaf' }).hover();

            await expect(popups).toHaveCount(1);
        });

        test('A disabled branch opens for neither pointer nor keyboard', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-disabled');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-disabled';
                document.body.appendChild(container);

                (window as any).cmDisabledRan = [];
                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [{
                                    label: 'Disabled branch',
                                    disabled: true,
                                    items: [{ label: 'Child' }]
                                }, {
                                    label: 'Disabled leaf',
                                    disabled: true,
                                    onClick: (): void => {
                                        (window as any).cmDisabledRan
                                            .push('leaf');
                                    }
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-disabled tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const popups = page.locator('.hcg-popup');
            const items = popups.first().locator('.hcg-menu-item');

            await expect(items.first()).toHaveAttribute('disabled', '');

            await items.first().hover({ force: true });
            await expect(popups).toHaveCount(1);

            // The branch button is disabled, so the key that activates it is
            // ignored by the button itself.
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('ArrowRight');
            await expect(popups).toHaveCount(1);

            await items.last().click({ force: true });
            expect(
                await page.evaluate(() => (window as any).cmDisabledRan)
            ).toEqual([]);
        });

        test('The focused item is marked once the keyboard is used', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-focus-ring');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-focus-ring';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [
                                    { label: 'First' },
                                    { label: 'Second' }
                                ]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-focus-ring tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            const marked = (): Promise<string[]> => page.evaluate(() => (
                [...document.querySelectorAll('.hcg-menu-item')]
                    .filter((el): boolean => (
                        getComputedStyle(el).boxShadow !== 'none'
                    ))
                    .map((el): string => (el as HTMLElement).innerText.trim())
            ));

            await cell.click({ button: 'right' });

            // Opened with the pointer: nothing is marked, although the first
            // item holds the focus for whoever reaches for a key.
            await expect(page.locator('.hcg-popup')).toHaveCount(1);
            expect(await marked()).toEqual([]);

            await page.keyboard.press('ArrowDown');

            expect(await marked()).toEqual(['Second']);
        });

        test('ArrowRight opens submenu and focuses first child', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-key-right');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-key-right';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [{
                                    type: 'submenu',
                                    label: 'Branch',
                                    items: [{ label: 'First child' }]
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-key-right tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await page.keyboard.press('ArrowRight');
            await expect(page.locator('.hcg-popup')).toHaveCount(2);

            const focusedLabel = await page.evaluate(() => (
                (document.activeElement as HTMLButtonElement | null)
                    ?.innerText?.trim() || ''
            ));
            expect(focusedLabel).toContain('First child');
        });

        test('ArrowLeft and Escape close submenu and restore parent focus', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-key-left-esc');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-key-left-esc';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    data: {
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [{
                                    type: 'submenu',
                                    label: 'Branch',
                                    items: [{ label: 'First child' }]
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-key-left-esc tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });
            await page.locator('.hcg-menu-item', { hasText: 'Branch' })
                .last()
                .click();

            await expect(page.locator('.hcg-popup')).toHaveCount(2);

            await page.keyboard.press('ArrowLeft');
            await expect(page.locator('.hcg-popup')).toHaveCount(1);

            let focusedLabel = await page.evaluate(() => (
                (document.activeElement as HTMLButtonElement | null)
                    ?.innerText?.trim() || ''
            ));
            expect(focusedLabel).toContain('Branch');

            await page.keyboard.press('ArrowRight');
            await expect(page.locator('.hcg-popup')).toHaveCount(2);
            await page.keyboard.press('Escape');
            await expect(page.locator('.hcg-popup')).toHaveCount(1);

            focusedLabel = await page.evaluate(() => (
                (document.activeElement as HTMLButtonElement | null)
                    ?.innerText?.trim() || ''
            ));
            expect(focusedLabel).toContain('Branch');

            await page.keyboard.press('Escape');
            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test(
            'A menu attached to an element of your own opens and runs',
            async ({ page }) => {
                await page.evaluate(() => {
                    document.getElementById('cm-attach')?.remove();
                    document.getElementById('cm-attach-button')?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-attach';
                    document.body.appendChild(container);

                    const button = document.createElement('button');
                    button.id = 'cm-attach-button';
                    button.type = 'button';
                    button.textContent = 'Actions';
                    document.body.appendChild(button);

                    const grid = (window as any).Grid.grid(container, {
                        data: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            }
                        }
                    });

                    grid.contextMenu.attach(button, {
                        items: [{
                            label: 'Rename the button',
                            onClick: (target: HTMLElement) => {
                                target.textContent = 'Renamed';
                            }
                        }, {
                            separator: true
                        }, {
                            label: 'Second action'
                        }]
                    });
                });

                const button = page.locator('#cm-attach-button');
                await button.click({ button: 'right' });

                const popup = page.locator('.hcg-popup');
                await expect(popup).toBeVisible();
                await expect(popup.locator('.hcg-menu-divider')).toHaveCount(1);

                // The grid clips its overflow, so a menu opened on an element
                // outside it is only whole because it renders in the top
                // layer. It stays a child of the grid, which is what keeps
                // the styles and the theme on it.
                expect(await page.evaluate(() => {
                    const el = document.querySelector('.hcg-popup');
                    const grid = document.querySelector('#cm-attach');
                    const p = el.getBoundingClientRect();
                    const g = grid.getBoundingClientRect();
                    return {
                        isPopover: el.matches(':popover-open'),
                        reachesPastTheGrid:
                            p.top < g.top || p.bottom > g.bottom,
                        insideViewport:
                            p.top >= 0 && p.bottom <= window.innerHeight,
                        insideTheGridElement: grid.contains(el)
                    };
                })).toEqual({
                    isPopover: true,
                    reachesPastTheGrid: true,
                    insideViewport: true,
                    insideTheGridElement: true
                });

                await popup.locator('.hcg-menu-item', {
                    hasText: 'Rename the button'
                }).click();

                await expect(button).toHaveText('Renamed');
                await expect(popup).toHaveCount(0);
            }
        );

        test(
            'A menu outgrows the grid by default, and not when kept inside',
            async ({ page }) => {
                const open = async (inside: boolean | undefined) => {
                    await page.evaluate((insideContainer) => {
                        document.getElementById('cm-top-layer')?.remove();

                        const container = document.createElement('div');
                        container.id = 'cm-top-layer';
                        // Too short for the menu below to fit in it.
                        container.style.height = '90px';
                        document.body.appendChild(container);

                        (window as any).Grid.grid(container, {
                            data: { columns: { id: ['ROW-001'] } },
                            rendering: { popups: { insideContainer } },
                            columnDefaults: {
                                cells: {
                                    contextMenu: {
                                        items: [
                                            { label: 'One' },
                                            { label: 'Two' },
                                            { label: 'Three' },
                                            { label: 'Four' }
                                        ]
                                    }
                                }
                            }
                        });
                    }, inside);

                    await page.locator(
                        '#cm-top-layer tbody td[data-column-id="id"]'
                    ).click({ button: 'right' });
                    await expect(page.locator('.hcg-popup')).toBeVisible();

                    return page.evaluate(() => {
                        const popup = document.querySelector('.hcg-popup');
                        const grid = document.getElementById('cm-top-layer');
                        const p = popup.getBoundingClientRect();
                        const g = grid.getBoundingClientRect();
                        return {
                            isPopover: popup.matches(':popover-open'),
                            outgrowsTheGrid: p.height > g.height
                        };
                    });
                };

                expect(await open(void 0)).toEqual({
                    isPopover: true,
                    outgrowsTheGrid: true
                });

                await page.keyboard.press('Escape');

                // Kept inside, the grid clips the menu, which scrolls within
                // it instead.
                expect(await open(true)).toEqual({
                    isPopover: false,
                    outgrowsTheGrid: false
                });
            }
        );

        test(
            'Without the Popover API the popup stays inside the container',
            async ({ page }) => {
                await page.addInitScript(() => {
                    // Popover is Baseline only since January 2025.
                    delete (HTMLElement.prototype as {
                        showPopover?: unknown;
                    }).showPopover;
                });
                await page.reload({ waitUntil: 'networkidle' });
                await page.waitForFunction(() => (
                    (window as any).Grid?.grids?.length > 0
                ));

                await page.evaluate(() => {
                    const container = document.createElement('div');
                    container.id = 'cm-no-popover';
                    container.style.height = '90px';
                    document.body.appendChild(container);

                    const grid = (window as any).Grid.grid(container, {
                        data: { columns: { id: ['ROW-001'] } },
                        // Asked for, but the browser cannot deliver it.
                        rendering: { popups: { insideContainer: false } },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    items: [
                                        { label: 'One' },
                                        { label: 'Two' },
                                        { label: 'Three' }
                                    ]
                                }
                            }
                        }
                    });

                    const button = document.createElement('button');
                    button.id = 'cm-no-popover-button';
                    document.body.appendChild(button);
                    grid.contextMenu.attach(button, {
                        items: [{ label: 'Attached' }]
                    });
                });

                const popup = page.locator('.hcg-popup');

                await page.locator(
                    '#cm-no-popover tbody td'
                ).first().click({ button: 'right' });
                await expect(popup).toBeVisible();
                expect(await page.evaluate(() => (
                    document.querySelector('.hcg-popup').hasAttribute('popover')
                ))).toBe(false);

                await page.keyboard.press('Escape');

                // The attached menu asks for a popover unconditionally, so it
                // is the one that would throw without the fallback.
                await page.locator(
                    '#cm-no-popover-button'
                ).click({ button: 'right' });
                await expect(popup).toBeVisible();
            }
        );

        test(
            'Items can be registered through the new and the old API',
            async ({ page }) => {
                await page.evaluate(() => {
                    const G = (window as any).Grid;

                    G.ContextMenu.registerItem('sayHello', {
                        label: 'Say hello',
                        targets: ['cell'],
                        onClick: (cell: { htmlElement: HTMLElement }) => {
                            cell.htmlElement.setAttribute('data-said', 'new');
                        }
                    });

                    // The pre-3.3.0 API, which nothing in Grid itself uses
                    // any more, still has to reach the same menu.
                    G.CellContextMenuBuiltInActions.registerBuiltInAction(
                        'sayLegacy',
                        {
                            getLabel: () => 'Say legacy',
                            icon: 'checkmark',
                            onClick: (context: {
                                cell: { htmlElement: HTMLElement };
                            }) => {
                                context.cell.htmlElement.setAttribute(
                                    'data-said',
                                    'legacy'
                                );
                            }
                        }
                    );

                    document.getElementById('cm-register')?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-register';
                    document.body.appendChild(container);

                    G.grid(container, {
                        data: { columns: { id: ['ROW-001'] } },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    items: ['sayHello', 'sayLegacy']
                                }
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-register tbody td[data-column-id="id"]'
                );

                await cell.click({ button: 'right' });
                await expect(page.locator('.hcg-menu-item')).toHaveText([
                    'Say hello',
                    'Say legacy'
                ]);

                await page.locator('.hcg-menu-item', {
                    hasText: 'Say legacy'
                }).click();
                await expect(cell).toHaveAttribute('data-said', 'legacy');

                await cell.click({ button: 'right' });
                await page.locator('.hcg-menu-item', {
                    hasText: 'Say hello'
                }).click();
                await expect(cell).toHaveAttribute('data-said', 'new');
            }
        );

        test(
            'A feature can open a menu on a surface of its own',
            async ({ page }) => {
                // What a composition would do: listen where the element is
                // built, then hand `open` a target of its own. No Core
                // change, and no registered item involved.
                await page.evaluate(async () => {
                    document.getElementById('cm-surface')?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-surface';
                    document.body.appendChild(container);

                    const grid = await (window as any).Grid.grid(container, {
                        data: { columns: { id: ['ROW-001'] } }
                    }, true);

                    const header = container.querySelector('thead th');

                    header.addEventListener('contextmenu', e => {
                        const opened = grid.contextMenu.open(
                            {
                                grid,
                                target: {
                                    type: 'header',
                                    cell: { htmlElement: header },
                                    column: grid.viewport.columns[0]
                                }
                            },
                            e.clientX,
                            e.clientY,
                            {
                                items: [{
                                    label: 'Sort this column',
                                    onClick: target => {
                                        target.htmlElement.setAttribute(
                                            'data-acted', 'yes'
                                        );
                                    }
                                }]
                            }
                        );

                        if (opened) {
                            e.preventDefault();
                        }
                    });
                });

                await page.waitForFunction(() => (
                    document.querySelector('#cm-surface thead th') !== null
                ));

                const header = page.locator('#cm-surface thead th').first();
                await header.click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toBeVisible();
                await expect(page.locator('.hcg-menu-item')).toHaveText([
                    'Sort this column'
                ]);

                await page.locator('.hcg-menu-item').click();
                await expect(header).toHaveAttribute('data-acted', 'yes');
            }
        );

        test(
            'A redraw closes an open menu and builds none when there is none',
            async ({ page }) => {
                await page.evaluate(async () => {
                    document.getElementById('cm-redraw')?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-redraw';
                    document.body.appendChild(container);

                    (window as any).cmRedrawGrid = await (window as any).Grid
                        .grid(container, {
                            data: {
                                idColumn: 'id',
                                columns: {
                                    id: ['ROW-001'],
                                    value: [1]
                                }
                            },
                            rendering: {
                                rows: {
                                    pinning: { enabled: true }
                                }
                            }
                        }, true);
                });

                const built = (): Promise<boolean> => page.evaluate(() => (
                    !!(window as any).cmRedrawGrid.contextMenuInstance
                ));

                // A redraw of a grid nobody opened a menu in builds none.
                await page.evaluate(async () => {
                    await (window as any).cmRedrawGrid.update({
                        columns: [{ id: 'value', className: 'redrawn' }]
                    });
                });

                expect(await built()).toBe(false);

                // One that is open goes away with the table it belongs to.
                await page.locator(
                    '#cm-redraw tbody tr[data-row-index="0"] ' +
                    'td[data-column-id="id"]'
                ).click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toHaveCount(1);

                await page.evaluate(async () => {
                    await (window as any).cmRedrawGrid.update({
                        columns: [{ id: 'value', className: 'redrawn-again' }]
                    });
                });

                await expect(page.locator('.hcg-popup')).toHaveCount(0);
            }
        );

    });
});
