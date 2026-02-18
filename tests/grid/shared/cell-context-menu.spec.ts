import { test, expect } from '~/fixtures.ts';

const cases = [
    {
        name: 'Grid Lite',
        url: '/grid-lite/cypress/cell-context-menu'
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

                const rowIndex = (await row.getAttribute('data-row-index')) ?? '';
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

            test('Right-click with no items keeps native (no popup created)', async ({ page }) => {
                const weightCell = page.locator(
                    'tbody tr[data-row-index="1"] td[data-column-id="weight"]'
                );

                await weightCell.click({ button: 'right' });

                await expect(page.locator('.hcg-popup')).toHaveCount(0);
            });
        });
    }

    test.describe('Grid Lite', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 900, height: 500 });
            await page.goto('/grid-lite/cypress/cell-context-menu', { waitUntil: 'networkidle' });

            await page.waitForFunction(() => {
                return typeof (window as any).Grid !== 'undefined' &&
                    (window as any).Grid.grids &&
                    (window as any).Grid.grids.length > 0;
            }, { timeout: 10000 });
        });

        test('Context menu closes after scrolling and refreshes context', async ({ page }) => {
            const initialState = await page.evaluate(() => {
                const grid = (window as any).Grid.grids[0];
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
                'tbody tr[data-row-index="1"] td[data-column-id="product"]'
            );

            await productCell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup');
            await expect(popup).toBeVisible();

            const initialBox = await popup.boundingBox();
            expect(initialBox, 'Popup should have a bounding box.').not.toBeNull();

            await page.evaluate((rowHeight) => {
                const grid = (window as any).Grid.grids[0];
                const vp = grid.viewport;
                const target = vp.tbodyElement;
                target.scrollTop += rowHeight * 100;
                target.dispatchEvent(new Event('scroll'));
            }, initialState.rowHeight);

            await page.waitForFunction((firstIndex: number | null) => {
                const grid = (window as any).Grid.grids[0];
                const vp = grid.viewport;
                return vp.rows[0]?.index !== firstIndex;
            }, initialState.firstIndex, { timeout: 10000 });

            await expect(popup).toBeHidden();

            const productCellAfterScroll = page.locator(
                'tbody tr:first-child td[data-column-id="product"]'
            );

            await expect(productCellAfterScroll).toBeVisible();
            await expect(productCellAfterScroll).toHaveText(/.+/);

            const rowAfterScroll = productCellAfterScroll.locator(
                'xpath=ancestor::tr[1]'
            );
            await expect(rowAfterScroll).toHaveAttribute('data-row-index', /.+/);

            const rowIndexAfterScroll =
                (await rowAfterScroll.getAttribute('data-row-index')) ?? '';
            const valueAfterScroll = ((await productCellAfterScroll.textContent()) ?? '').trim();
            const expected = rowIndexAfterScroll + '|product|' + valueAfterScroll;

            await productCellAfterScroll.click({ button: 'right' });
            await expect(popup).toBeVisible();
            await page.locator('.hcg-menu-item', { hasText: 'Show context' }).click();
            await expect(page.locator('#cellContextMenuResult')).toHaveValue(expected);
        });

        test('enabled with omitted items uses built-in defaults', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-builtins-test');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-test';
                document.body.appendChild(container);

                const grid = (window as any).Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['ROW-001', 'ROW-002'],
                            value: [1, 2]
                        }
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                idColumn: 'id'
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

                (window as any).cmBuiltinsGrid = grid;
            });

            const cell = page.locator(
                '#cm-builtins-test tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const popup = page.locator('.hcg-popup').last();
            await expect(popup).toContainText('Pin row to top');
            await expect(popup).toContainText('Pin row to bottom');
            await expect(popup).toContainText('Unpin row');

            await page.locator('.hcg-menu-item', { hasText: 'Pin row to top' })
                .last()
                .click();

            const pinned = await page.evaluate(() => (
                (window as any).cmBuiltinsGrid.getPinnedRows()
            ));

            expect(pinned.topIds).toEqual(['ROW-001']);
        });

        test('enabled with empty items keeps native context menu', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-builtins-empty');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-empty';
                document.body.appendChild(container);

                (window as any).Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['A'],
                            value: [1]
                        }
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                idColumn: 'id'
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

        test('mixed built-in and custom item definitions render in order', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-builtins-mixed');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-mixed';
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
                            pinning: {
                                idColumn: 'id'
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
                                        actionId: 'unpinRow',
                                        label: 'Unpin now'
                                    },
                                    {
                                        label: 'Custom action',
                                        onClick: () => {
                                            // noop
                                        }
                                    }
                                ]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtins-mixed tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const labels = await page.locator(
                '.hcg-popup .hcg-menu-item-label'
            ).allTextContents();

            expect(labels.slice(-3)).toEqual([
                'Pin row to top',
                'Unpin now',
                'Custom action'
            ]);
        });

        test('built-ins are disabled when row pinning is disabled', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById(
                    'cm-builtins-disabled'
                );
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtins-disabled';
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
                            pinning: {
                                enabled: false,
                                idColumn: 'id'
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

            const menuButtons = page.locator('.hcg-popup .hcg-menu-item');
            await expect(menuButtons).toHaveCount(3);

            const disabledCount = await page.locator(
                '.hcg-popup .hcg-menu-item[disabled]'
            ).count();

            expect(disabledCount).toBe(3);
        });

        test('branch item opens submenu on click', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-branch-open');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-branch-open';
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
                                items: [{
                                    label: 'Pin actions',
                                    items: ['pinRowTop', 'unpinRow']
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-branch-open tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await page.locator('.hcg-popup .hcg-menu-item', {
                hasText: 'Pin actions'
            }).last().click();

            const labels = await page.locator(
                '.hcg-popup .hcg-menu-item-label'
            ).allTextContents();

            expect(labels).toContain('Pin row to top');
            expect(labels).toContain('Unpin row');
        });

        test('recursive submenu closes full tree on leaf click', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-recursive');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-recursive';
                document.body.appendChild(container);

                (window as any).Grid.grid(
                    container,
                    {
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
                                    items: [{
                                        label: 'Level 1',
                                        items: [{
                                            label: 'Level 2',
                                            items: [{
                                                label: 'Leaf',
                                                onClick: function () {
                                                    // noop
                                                }
                                            }]
                                        }]
                                    }]
                                }
                            }
                        }
                    }
                );
            });

            const cell = page.locator(
                '#cm-recursive tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });
            await page.locator('.hcg-menu-item', { hasText: 'Level 1' })
                .last()
                .click();
            await page.locator('.hcg-menu-item', { hasText: 'Level 2' })
                .last()
                .click();
            await page.locator('.hcg-menu-item', { hasText: 'Leaf' })
                .last()
                .click();

            await expect(page.locator('.hcg-popup')).toHaveCount(0);
        });

        test('opening a submenu closes sibling submenus', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-siblings');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-siblings';
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
                                items: [{
                                    label: 'A',
                                    items: [{ label: 'A child' }]
                                }, {
                                    label: 'B',
                                    items: [{ label: 'B child' }]
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-siblings tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            await page.locator('.hcg-menu-item', { hasText: 'A' }).last().click();
            await expect(page.locator('.hcg-popup')).toHaveCount(2);
            await expect(page.locator('.hcg-menu-item-label', {
                hasText: 'A child'
            })).toHaveCount(1);

            await page.locator('.hcg-menu-item', { hasText: 'B' }).first().click();
            await expect(page.locator('.hcg-popup')).toHaveCount(2);
            await expect(page.locator('.hcg-menu-item-label', {
                hasText: 'A child'
            })).toHaveCount(0);
            await expect(page.locator('.hcg-menu-item-label', {
                hasText: 'B child'
            })).toHaveCount(1);
        });

        test('ArrowRight opens submenu and focuses first child', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-key-right');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-key-right';
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
                                items: [{
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
                                items: [{
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

        test('built-in branch uses defaults and only explicit disabled state', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-builtin-branch');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-builtin-branch';
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
                            pinning: {
                                enabled: false,
                                idColumn: 'id'
                            }
                        }
                    },
                    columnDefaults: {
                        cells: {
                            contextMenu: {
                                enabled: true,
                                items: [{
                                    actionId: 'pinRowTop',
                                    items: [{ label: 'Child 1' }]
                                }, {
                                    actionId: 'pinRowBottom',
                                    disabled: true,
                                    items: [{ label: 'Child 2' }]
                                }]
                            }
                        }
                    }
                });
            });

            const cell = page.locator(
                '#cm-builtin-branch tbody tr[data-row-index="0"] td[data-column-id="id"]'
            );
            await cell.click({ button: 'right' });

            const pinTopButton = page.locator('.hcg-menu-item', {
                hasText: 'Pin row to top'
            }).last();
            await expect(pinTopButton).not.toHaveAttribute('disabled', '');
            await pinTopButton.click();
            await expect(page.locator('.hcg-menu-item-label', {
                hasText: 'Child 1'
            })).toHaveCount(1);

            await page.keyboard.press('Escape');

            const pinBottomButton = page.locator('.hcg-menu-item', {
                hasText: 'Pin row to bottom'
            }).last();
            await expect(pinBottomButton).toHaveAttribute('disabled', '');
        });

        test('unknown built-in action id is ignored and warns once', async ({ page }) => {
            let unknownWarnCount = 0;
            const listener = (msg: any): void => {
                if (
                    msg.type() === 'warning' &&
                    msg.text().includes('Unknown built-in actionId')
                ) {
                    unknownWarnCount += 1;
                }
            };

            page.on('console', listener);

            try {
                await page.evaluate(() => {
                    const existing = document.getElementById('cm-builtins-unknown');
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-builtins-unknown';
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
                                pinning: {
                                    idColumn: 'id'
                                }
                            }
                        },
                        columnDefaults: {
                            cells: {
                                contextMenu: {
                                    enabled: true,
                                    items: ['pinRowTop', 'unknownAction' as any]
                                }
                            }
                        }
                    });
                });

                const cell = page.locator(
                    '#cm-builtins-unknown tbody tr[data-row-index="0"] td[data-column-id="id"]'
                );

                await cell.click({ button: 'right' });
                await page.keyboard.press('Escape');
                await cell.click({ button: 'right' });

                const labels = await page.locator(
                    '.hcg-popup .hcg-menu-item-label'
                ).allTextContents();

                expect(labels.slice(-1)).toEqual(['Pin row to top']);
                expect(unknownWarnCount).toBe(1);
            } finally {
                page.off('console', listener);
            }
        });
    });
});
