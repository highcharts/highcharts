import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro row/column mutations', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1000, height: 600 });
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        await page.waitForFunction(() => (
            typeof (window as any).Grid !== 'undefined' &&
            (window as any).Grid.grids &&
            (window as any).Grid.grids.length > 0
        ), { timeout: 10000 });
    });

    test('addRowAbove inserts at anchor original index', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-add-row-above')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-add-row-above';
            document.body.appendChild(container);

            (window as any).addRowAboveGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002', 'ROW-003'],
                            value: [10, 20, 30]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const result = await page.evaluate(async () => {
            const grid = (window as any).addRowAboveGrid;
            const id = await grid.gridEditing.addRowAbove(
                'ROW-002',
                { id: 'ROW-NEW', value: 99 }
            );
            const table = grid.dataProvider.getDataTable(false);
            return {
                id,
                ids: table.getColumn('id', true),
                values: table.getColumn('value', true)
            };
        });

        expect(result.id).toBe('ROW-NEW');
        expect(Array.from(result.ids)).toEqual([
            'ROW-001', 'ROW-NEW', 'ROW-002', 'ROW-003'
        ]);
        expect(Array.from(result.values)).toEqual([10, 99, 20, 30]);
    });

    test('addRowAbove creates a valid default row with idColumn', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-add-row-default')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-add-row-default';
            document.body.appendChild(container);

            (window as any).addRowDefaultGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            value: [10, 20]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const result = await page.evaluate(async () => {
            const grid = (window as any).addRowDefaultGrid;
            const insertedId = await grid.gridEditing.addRowAbove('ROW-002');
            const table = grid.dataProvider.getDataTable(false);
            return {
                insertedId,
                ids: Array.from(table.getColumn('id', true)),
                values: Array.from(table.getColumn('value', true))
            };
        });

        expect(typeof result.insertedId).toBe('string');
        expect(result.ids).toHaveLength(3);
        expect(new Set(result.ids).size).toBe(3);
        expect(result.ids).toEqual([
            'ROW-001',
            result.insertedId,
            'ROW-002'
        ]);
        expect(result.values).toEqual([10, null, 20]);
    });

    test('deleteRow removes row from table and refuses unknown id', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-delete-row')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-delete-row';
            document.body.appendChild(container);

            (window as any).deleteRowGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002', 'ROW-003'],
                            value: [10, 20, 30]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const after = await page.evaluate(async () => {
            const grid = (window as any).deleteRowGrid;
            await grid.gridEditing.deleteRow('ROW-002');
            await grid.gridEditing.deleteRow('ROW-DOES-NOT-EXIST');
            return Array.from(
                grid.dataProvider.getDataTable(false).getColumn('id', true)
            );
        });

        expect(after).toEqual(['ROW-001', 'ROW-003']);
    });

    test('deleteRow is disabled in context menu when only one row remains', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-delete-single')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-delete-single';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['ROW-ONLY'],
                        value: [1]
                    }
                },
                data: { idColumn: 'id' },
                columnDefaults: {
                    cells: { editMode: { enabled: true } }
                }
            });
        });

        const cell = page.locator(
            '#ge-delete-single tbody tr[data-row-index="0"] td[data-column-id="value"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await popup.locator('.hcg-menu-item', { hasText: 'Rows' })
            .last()
            .click();

        const submenu = page.locator('.hcg-popup').last();
        const deleteBtn = submenu.locator('.hcg-menu-item', {
            hasText: 'Delete row'
        }).last();
        await expect(deleteBtn).toBeVisible();
        await expect(deleteBtn).toBeDisabled();
    });

    test('addColumnAfter updates data table and grid column order', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-add-column')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-add-column';
            document.body.appendChild(container);

            (window as any).addColumnGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            value: [10, 20]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const columnIds = await page.evaluate(async () => {
            const grid = (window as any).addColumnGrid;
            await grid.gridEditing.addColumnAfter('id', {
                columnId: 'extra',
                column: [100, 200]
            });
            return {
                dataColumns: Object
                    .keys(grid.dataProvider.getDataTable(false).columns),
                gridOptionColumns:
                    (grid.options.columns || []).map((c: any) => c.id)
            };
        });

        expect(columnIds.dataColumns).toContain('extra');
        expect(columnIds.gridOptionColumns).toEqual([
            'id', 'extra', 'value'
        ]);
    });

    test('beforeRowChange cancel aborts the mutation', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-cancel')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-cancel';
            document.body.appendChild(container);

            (window as any).cancelGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            value: [10, 20]
                        }
                    },
                    data: { idColumn: 'id' },
                    gridEditing: {
                        events: {
                            beforeRowChange: (e: any): void => {
                                e.cancel = true;
                            }
                        }
                    },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const rowCount = await page.evaluate(async () => {
            const grid = (window as any).cancelGrid;
            await grid.gridEditing.deleteRow('ROW-001');
            return grid.dataProvider.getDataTable(false).rowCount;
        });

        expect(rowCount).toBe(2);
    });

    test('addRowBelow inserts immediately after anchor', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-add-below')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-add-below';
            document.body.appendChild(container);

            (window as any).addRowBelowGrid = (window as any).Grid.grid(
                container,
                {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002', 'ROW-003'],
                            value: [10, 20, 30]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                }
            );
        });

        const ids = await page.evaluate(async () => {
            const grid = (window as any).addRowBelowGrid;
            await grid.gridEditing.addRowBelow(
                'ROW-002',
                { id: 'ROW-NEW', value: 99 }
            );
            return Array.from(
                grid.dataProvider.getDataTable(false).getColumn('id', true)
            );
        });

        expect(ids).toEqual(['ROW-001', 'ROW-002', 'ROW-NEW', 'ROW-003']);
    });

    test('addColumnBefore inserts to the left of anchor', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-add-col-before')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-add-col-before';
            document.body.appendChild(container);

            (window as any).addColumnBeforeGrid = (window as any)
                .Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            value: [10, 20]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                });
        });

        const order = await page.evaluate(async () => {
            const grid = (window as any).addColumnBeforeGrid;
            await grid.gridEditing.addColumnBefore('value', {
                columnId: 'before',
                column: [1, 2]
            });
            return (grid.options.columns || []).map((c: any) => c.id);
        });

        expect(order).toEqual(['id', 'before', 'value']);
    });

    test('deleteColumn removes column from data and grid', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-delete-col')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-delete-col';
            document.body.appendChild(container);

            (window as any).deleteColumnGrid = (window as any)
                .Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            a: [1, 2],
                            b: [3, 4]
                        }
                    },
                    data: {
                        idColumn: 'id',
                        autogenerateColumns: false
                    },
                    columns: [
                        { id: 'id' },
                        { id: 'a' },
                        { id: 'b' }
                    ],
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                });
        });

        const state = await page.evaluate(async () => {
            const grid = (window as any).deleteColumnGrid;
            await grid.gridEditing.deleteColumn('a');
            return {
                dataColumns: Object.keys(
                    grid.dataProvider.getDataTable(false).columns
                ),
                userColumns: (grid.userOptions?.columns || [])
                    .map((c: any) => c.id)
            };
        });

        expect(state.dataColumns).not.toContain('a');
        expect(state.userColumns).toEqual(['id', 'b']);
    });

    test('deleteColumn refreshes autogenerated columns', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-delete-col-autogen')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-delete-col-autogen';
            document.body.appendChild(container);

            (window as any).deleteColumnAutogenGrid = (window as any)
                .Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            a: [1, 2],
                            b: [3, 4]
                        }
                    },
                    data: { idColumn: 'id' },
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                });
        });

        const state = await page.evaluate(async () => {
            const grid = (window as any).deleteColumnAutogenGrid;
            await grid.gridEditing.deleteColumn('a');
            return {
                dataColumns: Object.keys(
                    grid.dataProvider.getDataTable(false).columns
                ),
                renderedColumns: grid.viewport.columns.map((c: any) => c.id),
                userColumns: (grid.userOptions?.columns || [])
                    .map((c: any) => c.id),
                autogenerateColumns:
                    grid.userOptions?.data?.autogenerateColumns
            };
        });

        expect(state.dataColumns).not.toContain('a');
        expect(state.renderedColumns).toEqual(['id', 'b']);
        expect(state.userColumns).toEqual(['id', 'b']);
        expect(state.autogenerateColumns).toBe(false);
    });

    test('explicit unsupported add actions are disabled', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-explicit-unsupported')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-explicit-unsupported';
            document.body.appendChild(container);

            (window as any).Grid.grid(container, {
                data: {
                    providerType: 'remote',
                    idColumn: 'id',
                    fetchCallback: () => Promise.resolve({
                        columns: {
                            id: ['ROW-001'],
                            value: [1]
                        },
                        totalRowCount: 1
                    })
                },
                columns: [{
                    id: 'id',
                    cells: { editMode: { enabled: true } }
                }, {
                    id: 'value',
                    cells: {
                        editMode: { enabled: true },
                        contextMenu: {
                            enabled: true,
                            items: ['addRowAbove', 'addColumnBefore']
                        }
                    }
                }]
            });
        });

        const cell = page.locator(
            '#ge-explicit-unsupported tbody tr[data-row-index="0"] td[data-column-id="value"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await expect(popup.locator('.hcg-menu-item', {
            hasText: 'Add row above'
        }).last()).toBeDisabled();
        await expect(popup.locator('.hcg-menu-item', {
            hasText: 'Add column before'
        }).last()).toBeDisabled();
    });

    test('referencing an inactive group key contributes no items and no warning', async ({ page }) => {
        const warnings: string[] = [];
        page.on('console', (msg): void => {
            if (msg.type() === 'warning') {
                warnings.push(msg.text());
            }
        });

        await page.evaluate(() => {
            document.getElementById('ge-inactive-group')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-inactive-group';
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
                            items: [
                                'pinning',
                                {
                                    label: 'Custom',
                                    onClick: (): void => { }
                                }
                            ]
                        }
                    }
                }
            });
        });

        const cell = page.locator(
            '#ge-inactive-group tbody tr[data-row-index="0"] td[data-column-id="id"]'
        );
        await cell.click({ button: 'right' });

        const popup = page.locator('.hcg-popup').last();
        await expect(popup).toBeVisible();
        await expect(popup).toContainText('Custom');
        await expect(popup).not.toContainText('Pin row to top');

        const noise = warnings.filter((w): boolean =>
            /Unknown built-in/.test(w) && /pinning/.test(w)
        );
        expect(noise).toEqual([]);
    });

    test('deleteColumn is disabled for unbound and idColumn', async ({ page }) => {
        await page.evaluate(() => {
            document.getElementById('ge-delete-col-guard')?.remove();
            const container = document.createElement('div');
            container.id = 'ge-delete-col-guard';
            document.body.appendChild(container);

            (window as any).deleteColumnGuardGrid = (window as any)
                .Grid.grid(container, {
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
                    columns: [
                        { id: 'id' },
                        { id: 'value' },
                        {
                            id: 'doubled',
                            cells: {
                                formatter: function (
                                    this: any
                                ): string {
                                    return String((this.value || 0) * 2);
                                }
                            }
                        }
                    ],
                    columnDefaults: {
                        cells: { editMode: { enabled: true } }
                    }
                });
        });

        const flags = await page.evaluate(() => {
            const editing = (window as any).deleteColumnGuardGrid.gridEditing;
            return {
                idColumnDeletable: editing.isColumnDeletable('id'),
                valueColumnDeletable: editing.isColumnDeletable('value'),
                unboundDeletable: editing.isColumnDeletable('doubled')
            };
        });

        expect(flags.idColumnDeletable).toBe(false);
        expect(flags.valueColumnDeletable).toBe(true);
        expect(flags.unboundDeletable).toBe(false);
    });
});
