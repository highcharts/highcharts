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
                        dataTable: {
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
            'No contextMenu config with explicit pinning shows defaults',
            async ({ page }) => {
                await page.evaluate(() => {
                    const existing = document.getElementById('cm-auto-on');
                    existing?.remove();

                    const container = document.createElement('div');
                    container.id = 'cm-auto-on';
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

        test('Auto mode reacts to runtime pinning updates', async ({ page }) => {
            await page.evaluate(() => {
                const existing = document.getElementById('cm-auto-runtime');
                existing?.remove();

                const container = document.createElement('div');
                container.id = 'cm-auto-runtime';
                document.body.appendChild(container);

                (window as any).cmAutoRuntimeGrid = (window as any).Grid.grid(
                    container,
                    {
                        dataTable: {
                            columns: {
                                id: ['ROW-001'],
                                value: [1]
                            }
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
                            pinning: {
                                idColumn: 'id'
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
                                enabled: false,
                                idColumn: 'id'
                            }
                        }
                    }
                });
            });

            await cell.click({ button: 'right' });
            await expect(page.locator('.hcg-popup')).toHaveCount(0);
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

    });
});
