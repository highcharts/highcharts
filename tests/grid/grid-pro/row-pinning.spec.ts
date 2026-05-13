import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro row pinning', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');

        await page.evaluate(() => {
            const rowCount = 60;
            const rows = Array.from({ length: rowCount }, (_, i) => {
                const id = 'ROW-' + String(i + 1).padStart(3, '0');

                return {
                    id,
                    product: 'Product ' + (i + 1),
                    group: ['A', 'B', 'C'][i % 3],
                    stock: 10 + (i % 40)
                };
            });

            document.body.innerHTML = `
                <div id="container" style="height: 520px;"></div>
                <input
                    id="pinnedTop"
                    type="text"
                    aria-label="top pinned"
                    readonly
                />
                <input
                    id="pinnedBottom"
                    type="text"
                    aria-label="bottom pinned"
                    readonly
                />
            `;

            const topInput = document.getElementById(
                'pinnedTop'
            ) as HTMLInputElement | null;
            const bottomInput = document.getElementById(
                'pinnedBottom'
            ) as HTMLInputElement | null;

            function updatePinnedInputs(grid: any): void {
                const pinned = grid.rowPinning.getPinnedRows();

                if (topInput) {
                    topInput.value = pinned.topIds.join(',');
                }

                if (bottomInput) {
                    bottomInput.value = pinned.bottomIds.join(',');
                }
            }

            const grid = (window as any).Grid.grid('container', {
                dataTable: {
                    columns: {
                        id: rows.map((row) => row.id),
                        product: rows.map((row) => row.product),
                        group: rows.map((row) => row.group),
                        stock: rows.map((row) => row.stock)
                    }
                },
                rendering: {
                    rows: {
                        virtualizationThreshold: 20,
                        pinning: {
                            idColumn: 'id',
                            topIds: ['ROW-001'],
                            bottomIds: ['ROW-060']
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

            function wrapPinnedMethod(methodName: string): void {
                const method = grid.rowPinning[
                    methodName
                ]?.bind(grid.rowPinning);
                grid.rowPinning[methodName] = function (
                    ...args: Array<any>
                ): Promise<any> {
                    return Promise.resolve(method(...args)).then((result) => {
                        updatePinnedInputs(grid);
                        return result;
                    });
                };
            }

            wrapPinnedMethod('pin');
            wrapPinnedMethod('toggle');
            wrapPinnedMethod('unpin');

            (window as any).grid = grid;
            updatePinnedInputs(grid);
        });

        await page.waitForFunction(() => {
            return typeof (window as any).grid !== 'undefined';
        });

        await page.waitForFunction(() => {
            return document.querySelectorAll('tbody td').length > 0;
        });
    });

    test('Pin and unpin rows through context menu', async ({ page }) => {
        await expect(page.locator('#pinnedTop')).toHaveValue('ROW-001');
        await expect(page.locator('#pinnedBottom')).toHaveValue('ROW-060');

        const topActionCell = page.locator(
            'tbody:not(.hcg-tbody-pinned) tr[data-row-index="5"] td[data-column-id="id"]'
        );
        await expect(topActionCell).toBeVisible();

        await topActionCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Pin row to top' }).click();

        await expect(page.locator('#pinnedTop')).toHaveValue('ROW-001,ROW-006');

        const pinnedTopCell = page.locator(
            'tbody.hcg-tbody-pinned-top td[data-column-id="id"]',
            { hasText: 'ROW-006' }
        );
        await expect(pinnedTopCell).toBeVisible();

        await expect(page.locator(
            'tbody:not(.hcg-tbody-pinned) td[data-column-id="id"]',
            { hasText: 'ROW-006' }
        )).toHaveCount(1);

        await pinnedTopCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Unpin row' }).click();

        await expect(page.locator('#pinnedTop')).toHaveValue('ROW-001');

        const bottomActionCell = page.locator(
            'tbody:not(.hcg-tbody-pinned) tr[data-row-index="6"] td[data-column-id="id"]'
        );
        await expect(bottomActionCell).toBeVisible();

        await bottomActionCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Pin row to bottom' }).click();

        await expect(page.locator('#pinnedBottom')).toHaveValue(
            'ROW-060,ROW-007'
        );
        await expect(page.locator(
            'tbody.hcg-tbody-pinned-bottom td[data-column-id="id"]',
            { hasText: 'ROW-007' }
        )).toBeVisible();
    });

    test('Updates pinned rows when membership changes at same counts', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });

            const before = Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => el.textContent?.trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-010'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });

            const after = Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => el.textContent?.trim());

            return { before, after };
        });

        expect(state.before).toEqual(['ROW-001']);
        expect(state.after).toEqual(['ROW-010']);
    });

    test('Pinned sections apply configured max-height scrolling', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002', 'ROW-003'],
                            bottomIds: ['ROW-058', 'ROW-059', 'ROW-060'],
                            top: {
                                maxHeight: 80
                            },
                            bottom: {
                                maxHeight: '25%'
                            }
                        }
                    }
                }
            });

            const topTbody = grid.viewport.rowPinningView
                .pinnedTopTbodyElement;
            const bottomTbody = grid.viewport.rowPinningView
                .pinnedBottomTbodyElement;

            return {
                topMaxHeight: topTbody.style.maxHeight,
                topOverflowY: topTbody.style.overflowY,
                topOverflowX: topTbody.style.overflowX,
                bottomMaxHeight: bottomTbody.style.maxHeight,
                bottomOverflowY: bottomTbody.style.overflowY,
                bottomOverflowX: bottomTbody.style.overflowX,
                tableHeight: grid.viewport.tableElement.clientHeight
            };
        });

        expect(state.topMaxHeight).toBe('80px');
        expect(state.topOverflowY).toBe('auto');
        expect(state.topOverflowX).toBe('hidden');
        expect(state.bottomMaxHeight).toBe(
            Math.round(state.tableHeight * 0.25) + 'px'
        );
        expect(state.bottomOverflowY).toBe('auto');
        expect(state.bottomOverflowX).toBe('hidden');
    });

    test('Row pinning announcements skip no-op runtime calls', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const calls: string[] = [];
            const announce = grid.accessibility?.announce?.bind(
                grid.accessibility
            );

            if (announce) {
                grid.accessibility.announce = (
                    message: string,
                    assertive?: boolean
                ): void => {
                    calls.push(message);
                    announce(message, assertive);
                };
            }

            await grid.update({
                accessibility: {
                    announcements: {
                        rowPinning: true
                    }
                }
            });

            await grid.rowPinning.pin('ROW-001', 'top');
            await grid.rowPinning.unpin('ROW-020');

            return { calls };
        });

        expect(state.calls).toEqual([]);
    });

    test('Pinned rows expose section context in aria-roledescription for pinned and scrollable copies', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.rowPinning.pin('ROW-010', 'top');

            const topRow = grid.viewport.rowPinningView
                .getRenderedPinnedRowById(
                    'ROW-010',
                    'top'
                );
            const scrollRow = grid.viewport.getRenderedRows().find((
                row: { id: string; bodySectionId?: string }
            ) => (
                row.id === 'ROW-010' && !row.bodySectionId
            ));

            return {
                topDescription: (
                    topRow?.htmlElement?.getAttribute('aria-roledescription') ||
                    ''
                ),
                scrollDescription: (
                    scrollRow?.htmlElement?.getAttribute(
                        'aria-roledescription'
                    ) || ''
                )
            };
        });

        expect(state.topDescription).toContain('Pinned row in top section.');
        expect(state.scrollDescription).toContain(
            'also pinned to top section'
        );
    });

    test('Pinned bottom rows expose section context in aria-roledescription', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.rowPinning.pin('ROW-020', 'bottom');

            const bottomRow = grid.viewport.rowPinningView
                .getRenderedPinnedRowById(
                    'ROW-020',
                    'bottom'
                );

            return {
                bottomDescription: (
                    bottomRow?.htmlElement?.getAttribute(
                        'aria-roledescription'
                    ) || ''
                )
            };
        });

        expect(state.bottomDescription).toContain(
            'Pinned row in bottom section.'
        );
    });

    test('aria-rowcount stays coherent with pinned rendered row indexes', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002'],
                            bottomIds: ['ROW-059', 'ROW-060']
                        }
                    }
                }
            });

            const rowIndexes = Array.from(
                document.querySelectorAll('tbody tr[aria-rowindex]')
            ).map((row): number => parseInt(
                row.getAttribute('aria-rowindex') || '0',
                10
            ));
            const maxRowIndex = rowIndexes.length ?
                Math.max(...rowIndexes) :
                0;
            const rowCount = parseInt(
                grid.tableElement?.getAttribute('aria-rowcount') || '0',
                10
            );

            return {
                maxRowIndex,
                rowCount
            };
        });

        expect(state.rowCount).toBeGreaterThanOrEqual(state.maxRowIndex);
    });

    test('Disabling pinning UI preserves config and runtime pinning API', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedIds = (section: 'top'|'bottom'): string[] => {
                const tbody = (section === 'top' ?
                    grid.viewport.rowPinningView.pinnedTopTbodyElement :
                    grid.viewport.rowPinningView.pinnedBottomTbodyElement
                ) as HTMLElement;
                return Array.from(
                    tbody.querySelectorAll('td[data-column-id="id"]')
                ).map((el: Element) => (el.textContent || '').trim());
            };

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            enabled: false,
                            topIds: ['ROW-001', 'ROW-002'],
                            bottomIds: ['ROW-060'],
                            resolve: (row: Record<string, unknown>) => (
                                row.id === 'ROW-003' ? 'top' : null
                            )
                        }
                    }
                }
            });

            const vp = grid.viewport;

            const afterDisable = {
                pinned: grid.rowPinning.getPinnedRows(),
                topConnected: (
                    vp.rowPinningView.pinnedTopTbodyElement.parentElement ===
                    vp.tableElement
                ),
                topRenderedIds: getPinnedIds('top'),
                bottomConnected: (
                    vp.rowPinningView
                        .pinnedBottomTbodyElement.parentElement ===
                    vp.tableElement
                ),
                bottomRenderedIds: getPinnedIds('bottom')
            };

            await grid.rowPinning.pin('ROW-005', 'top');
            await grid.rowPinning.toggle('ROW-006', 'bottom');
            await grid.rowPinning.unpin('ROW-001');

            return {
                afterDisable,
                afterRuntimeCalls: {
                    pinned: grid.rowPinning.getPinnedRows(),
                    topConnected: (
                        vp.rowPinningView.pinnedTopTbodyElement
                            .parentElement === vp.tableElement
                    ),
                    topRenderedIds: getPinnedIds('top'),
                    bottomConnected: (
                        vp.rowPinningView
                            .pinnedBottomTbodyElement.parentElement ===
                        vp.tableElement
                    ),
                    bottomRenderedIds: getPinnedIds('bottom')
                }
            };
        });

        expect(state.afterDisable.pinned.topIds).toEqual([
            'ROW-001',
            'ROW-002',
            'ROW-003'
        ]);
        expect(state.afterDisable.pinned.bottomIds).toEqual(['ROW-060']);
        expect(state.afterDisable.topConnected).toBe(true);
        expect(state.afterDisable.bottomConnected).toBe(true);
        expect(state.afterDisable.topRenderedIds).toEqual([
            'ROW-001',
            'ROW-002',
            'ROW-003'
        ]);
        expect(state.afterDisable.bottomRenderedIds).toEqual(['ROW-060']);

        expect(state.afterRuntimeCalls.pinned.topIds).toEqual([
            'ROW-002',
            'ROW-005',
            'ROW-003'
        ]);
        expect(state.afterRuntimeCalls.pinned.bottomIds).toEqual([
            'ROW-060',
            'ROW-006'
        ]);
        expect(state.afterRuntimeCalls.topConnected).toBe(true);
        expect(state.afterRuntimeCalls.bottomConnected).toBe(true);
        expect(state.afterRuntimeCalls.topRenderedIds).toEqual([
            'ROW-002',
            'ROW-005',
            'ROW-003'
        ]);
        expect(state.afterRuntimeCalls.bottomRenderedIds).toEqual([
            'ROW-060',
            'ROW-006'
        ]);
    });

    test('Pinned section is stable across sort and filter', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                columns: [{
                    id: 'stock',
                    sorting: { order: null }
                }, {
                    id: 'group',
                    filtering: void 0
                }],
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-003', 'ROW-001'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });

            const before = getPinnedTopIds();

            await grid.update({
                columns: [{
                    id: 'stock',
                    sorting: { order: 'asc' }
                }, {
                    id: 'group',
                    filtering: {
                        condition: 'equals',
                        value: 'B'
                    }
                }]
            });

            return {
                before,
                after: getPinnedTopIds()
            };
        });

        expect(state.before).toEqual(['ROW-003', 'ROW-001']);
        expect(state.after).toEqual(['ROW-003', 'ROW-001']);
    });

    test('scrollToRow is safe with pinning in non-virtual mode', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: false,
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002', 'ROW-003'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });

            let error: string | undefined;
            try {
                grid.viewport.scrollToRow(10);
                grid.viewport.scrollToRow(0);
                grid.viewport.scrollToRow(59);
            } catch (e) {
                error = String(e);
            }

            return {
                error,
                scrollTop: grid.viewport.tbodyElement.scrollTop
            };
        });

        expect(state.error).toBeUndefined();
        expect(state.scrollTop).toBeGreaterThanOrEqual(0);
    });

    test('Keyboard navigation transitions between pinned and scrollable rows', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });
        });

        const firstPinnedCell = page.locator(
            'tbody.hcg-tbody-pinned-top tr[data-pinned-section="top"] td[data-column-id="id"]'
        ).first();
        await firstPinnedCell.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'ROW-001');

        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'ROW-002');
    });

    test('aria-rowindex order is monotonic across rendered pinned sections', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002'],
                            bottomIds: ['ROW-059', 'ROW-060']
                        }
                    }
                }
            });

            const rows = Array.from(
                document.querySelectorAll(
                    'tbody.hcg-tbody-pinned-top tr,' +
                    'tbody:not(.hcg-tbody-pinned) tr,' +
                    'tbody.hcg-tbody-pinned-bottom tr'
                )
            );
            const indexes = rows.map((row): number => parseInt(
                row.getAttribute('aria-rowindex') || '0',
                10
            ));
            const topIndexes = Array.from(document.querySelectorAll(
                'tbody.hcg-tbody-pinned-top tr'
            )).map((row): number => parseInt(
                row.getAttribute('aria-rowindex') || '0',
                10
            ));
            const scrollIndexes = Array.from(document.querySelectorAll(
                'tbody:not(.hcg-tbody-pinned) tr'
            )).map((row): number => parseInt(
                row.getAttribute('aria-rowindex') || '0',
                10
            ));
            const bottomIndexes = Array.from(document.querySelectorAll(
                'tbody.hcg-tbody-pinned-bottom tr'
            )).map((row): number => parseInt(
                row.getAttribute('aria-rowindex') || '0',
                10
            ));

            return {
                indexes,
                topIndexes,
                scrollIndexes,
                bottomIndexes
            };
        });

        expect(state.indexes.length).toBeGreaterThan(4);
        for (let i = 1; i < state.indexes.length; ++i) {
            expect(state.indexes[i]).toBeGreaterThan(state.indexes[i - 1]);
        }

        expect(state.topIndexes[0]).toBeGreaterThanOrEqual(2);
        expect(state.scrollIndexes[0]).toBeGreaterThan(
            state.topIndexes[state.topIndexes.length - 1]
        );
        expect(state.bottomIndexes[0]).toBeGreaterThan(
            state.scrollIndexes[state.scrollIndexes.length - 1]
        );
    });

    test('All rows pinned does not show "page 1 of 0"', async ({ page }) => {
        await page.evaluate(async () => {
            const grid = (window as any).grid;
            const rowIds = Array.from({ length: 60 }, (_, i) => (
                'ROW-' + String(i + 1).padStart(3, '0')
            ));

            await grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                },
                rendering: {
                    rows: {
                        virtualization: false,
                        pinning: {
                            idColumn: 'id',
                            topIds: rowIds
                        }
                    }
                }
            });
        });

        const pageInfo = page.locator('.hcg-pagination-info').first();
        await expect(pageInfo).not.toContainText('page 1 of 0');
    });

    test('Non-virtual sorting keeps pinned order stable', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const getScrollableIds = (): string[] => Array.from(
                (grid.viewport.tbodyElement as HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: false,
                        pinning: {
                            topIds: ['ROW-003', 'ROW-001'],
                            bottomIds: ['ROW-060']
                        }
                    }
                },
                columns: [{
                    id: 'stock',
                    sorting: { order: 'asc' }
                }]
            });

            return {
                pinnedTop: getPinnedTopIds(),
                scrollable: getScrollableIds()
            };
        });

        expect(state.pinnedTop).toEqual(['ROW-003', 'ROW-001']);
        expect(state.scrollable).toContain('ROW-001');
        expect(state.scrollable).toContain('ROW-003');
    });

    test('Pin and unpin do not change active page with pagination', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const activePage = (): string => (
                grid.pagination.pageNumbersContainer.querySelector(
                    '.hcg-button-selected'
                )?.textContent || ''
            ).trim();

            await grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 2
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            });

            const before = activePage();
            await grid.rowPinning.pin('ROW-012', 'top');
            const afterPin = activePage();
            await grid.rowPinning.unpin('ROW-012');
            const afterUnpin = activePage();

            return {
                before,
                afterPin,
                afterUnpin
            };
        });

        expect(state.before).toBe('2');
        expect(state.afterPin).toBe('2');
        expect(state.afterUnpin).toBe('2');
    });

    test('grid.rowPinning.pin supports insertion index within pinned collection', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002']
                        }
                    }
                }
            });

            await grid.rowPinning.pin('ROW-010', 'top', 0);
            const afterFirstInsert = getPinnedTopIds();

            await grid.rowPinning.pin('ROW-011', 'top', 1);
            const afterSecondInsert = getPinnedTopIds();

            return {
                afterFirstInsert,
                afterSecondInsert
            };
        });

        expect(state.afterFirstInsert).toEqual([
            'ROW-010',
            'ROW-001',
            'ROW-002'
        ]);
        expect(state.afterSecondInsert).toEqual([
            'ROW-010',
            'ROW-011',
            'ROW-001',
            'ROW-002'
        ]);
    });

    test('resolve pinning remains disabled after explicit unpin when pinning UI is disabled', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            enabled: false,
                            topIds: [],
                            bottomIds: [],
                            resolve: (row: Record<string, unknown>) => (
                                row.id === 'ROW-001' ? 'top' : null
                            )
                        }
                    }
                }
            });

            const beforeUnpin = getPinnedTopIds();
            await grid.rowPinning.unpin('ROW-001');

            await grid.update({
                columns: [{
                    id: 'stock',
                    sorting: { order: 'asc' }
                }]
            });

            const afterUnpinAndRecompute = getPinnedTopIds();

            return {
                beforeUnpin,
                afterUnpinAndRecompute
            };
        });

        expect(state.beforeUnpin).toContain('ROW-001');
        expect(state.afterUnpinAndRecompute).not.toContain('ROW-001');
    });

    test('resolve callback errors do not break pinning pipeline', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            let error: string | undefined;
            try {
                await grid.update({
                    rendering: {
                        rows: {
                            pinning: {
                                topIds: [],
                                bottomIds: [],
                                resolve: (row: Record<string, unknown>) => {
                                    if (row.id === 'ROW-001') {
                                        throw new Error('resolve failed');
                                    }
                                    return row.id === 'ROW-002' ?
                                        'top' :
                                        null;
                                }
                            }
                        }
                    }
                });
            } catch (e) {
                error = String(e);
            }

            return {
                error,
                pinnedTop: getPinnedTopIds()
            };
        });

        expect(state.error).toBeUndefined();
        expect(state.pinnedTop).toContain('ROW-002');
        expect(state.pinnedTop).not.toContain('ROW-001');
    });

    test('Horizontal scroll stays synced on scroll and applyStateMeta', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const container = document.getElementById('container');
            if (container) {
                container.style.width = '360px';
            }

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001'],
                            bottomIds: ['ROW-060']
                        }
                    }
                },
                columns: [{
                    id: 'id',
                    width: 180
                }, {
                    id: 'product',
                    width: 220
                }, {
                    id: 'group',
                    width: 180
                }, {
                    id: 'stock',
                    width: 180
                }]
            });

            const beforeMain = grid.viewport.tbodyElement.scrollWidth >
                grid.viewport.tbodyElement.clientWidth;

            grid.viewport.tbodyElement.scrollLeft = 120;
            grid.viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            const meta = grid.viewport.getStateMeta();

            grid.viewport.tbodyElement.scrollLeft = 0;
            grid.viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            grid.viewport.applyStateMeta(meta);

            const topRow = document.querySelector<HTMLElement>(
                'tbody.hcg-tbody-pinned-top tr'
            );
            const bottomRow = document.querySelector<HTMLElement>(
                'tbody.hcg-tbody-pinned-bottom tr'
            );

            return {
                hasHorizontalOverflow: beforeMain,
                main: grid.viewport.tbodyElement.scrollLeft,
                topTransform: topRow?.style.transform || '',
                bottomTransform: bottomRow?.style.transform || ''
            };
        });

        expect(state.hasHorizontalOverflow).toBe(true);
        expect(state.main).toBeGreaterThan(0);
        expect(state.topTransform).toContain('-120px');
        expect(state.bottomTransform).toContain('-120px');
    });

    test('keeps the acted-on visible row anchored through top pin and unpin', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const waitForLayout = async (): Promise<void> => {
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
            };
            const getScrollableRowTop = (rowId: string): number | undefined => {
                const row = grid.viewport.tbodyElement.querySelector(
                    `tr[data-row-id="${rowId}"]`
                ) as HTMLElement | null;

                return row?.getBoundingClientRect().top;
            };

            grid.viewport.scrollToRow(20);
            grid.viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            await waitForLayout();

            const before = getScrollableRowTop('ROW-021');

            await grid.rowPinning.pin('ROW-021', 'top');
            await waitForLayout();
            const afterPin = getScrollableRowTop('ROW-021');

            await grid.rowPinning.unpin('ROW-021');
            await waitForLayout();
            const afterUnpin = getScrollableRowTop('ROW-021');

            return {
                before,
                afterPin,
                afterUnpin
            };
        });

        expect(state.before).toBeDefined();
        expect(state.afterPin).toBeDefined();
        expect(state.afterUnpin).toBeDefined();
        expect(Math.abs((state.afterPin || 0) - (state.before || 0)))
            .toBeLessThanOrEqual(2);
        expect(Math.abs((state.afterUnpin || 0) - (state.before || 0)))
            .toBeLessThanOrEqual(2);
    });

    test('compensates viewport when an offscreen top pin would shrink the main body', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const waitForLayout = async (): Promise<void> => {
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
            };
            const getScrollableRowTop = (rowId: string): number | undefined => {
                const row = grid.viewport.tbodyElement.querySelector(
                    `tr[data-row-id="${rowId}"]`
                ) as HTMLElement | null;

                return row?.getBoundingClientRect().top;
            };

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            topIds: ['ROW-001']
                        }
                    }
                }
            });

            grid.viewport.scrollToRow(24);
            grid.viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            await waitForLayout();

            const anchorRowId = 'ROW-025';
            const before = getScrollableRowTop(anchorRowId);
            const scrollTopBefore = grid.viewport.tbodyElement.scrollTop;

            await grid.rowPinning.pin('ROW-002', 'top', 0);
            await waitForLayout();

            return {
                before,
                after: getScrollableRowTop(anchorRowId),
                scrollTopBefore,
                scrollTopAfter: grid.viewport.tbodyElement.scrollTop
            };
        });

        expect(state.before).toBeDefined();
        expect(state.after).toBeDefined();
        expect(state.scrollTopAfter).toBeGreaterThan(state.scrollTopBefore);
        expect(Math.abs((state.after || 0) - (state.before || 0)))
            .toBeLessThanOrEqual(2);
    });

    test('Pinned rows work with explicit virtualization true', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const getScrollableIds = (): string[] => Array.from(
                (grid.viewport.tbodyElement as HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: true,
                        pinning: {
                            topIds: ['ROW-001', 'ROW-002'],
                            bottomIds: ['ROW-060']
                        }
                    }
                }
            });

            grid.viewport.tbodyElement.scrollTop = 300;
            const scrollTop = grid.viewport.tbodyElement.scrollTop;

            return {
                virtualRows: grid.viewport.virtualRows,
                scrollTop,
                pinnedTop: getPinnedTopIds(),
                scrollable: getScrollableIds()
            };
        });

        expect(state.virtualRows).toBe(true);
        expect(state.scrollTop).toBeGreaterThan(0);
        expect(state.pinnedTop).toEqual(['ROW-001', 'ROW-002']);
        expect(state.scrollable).toContain('ROW-001');
        expect(state.scrollable).toContain('ROW-002');
    });

    test('Empty data table with pinning configuration is safe', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            let error: string | undefined;

            try {
                await grid.update({
                    dataTable: {
                        columns: {
                            id: [],
                            product: [],
                            group: [],
                            stock: []
                        }
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                idColumn: 'id',
                                topIds: ['ROW-001'],
                                bottomIds: ['ROW-060']
                            }
                        }
                    }
                });
            } catch (e) {
                error = String(e);
            }

            return {
                error,
                topRows: grid.viewport.rowPinningView.getRows('top').length,
                bottomRows: grid.viewport.rowPinningView.getRows('bottom').length,
                scrollableRows: grid.viewport.rows.length
            };
        });

        expect(state.error).toBeUndefined();
        expect(state.topRows).toBe(0);
        expect(state.bottomRows).toBe(0);
        expect(state.scrollableRows).toBe(0);
    });

    test('local missing pinned ids clear previously cached pinned row objects', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                (grid.viewport.rowPinningView.pinnedTopTbodyElement as
                HTMLElement).querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            const before = {
                pinning: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            await grid.update({
                dataTable: {
                    columns: {
                        id: [],
                        product: [],
                        group: [],
                        stock: []
                    }
                },
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'id',
                            topIds: ['ROW-001'],
                            bottomIds: []
                        }
                    }
                }
            });

            return {
                before,
                after: {
                    pinning: grid.rowPinning.getPinnedRows(),
                    pinnedTop: getPinnedTopIds(),
                    topRows: grid.viewport.rowPinningView.getRows('top').length
                }
            };
        });

        expect(state.before.pinning.topIds).toEqual(['ROW-001']);
        expect(state.before.pinnedTop).toEqual(['ROW-001']);
        expect(state.after.pinning.topIds).toEqual([]);
        expect(state.after.pinnedTop).toEqual([]);
        expect(state.after.topRows).toBe(0);
    });

    test('getPinnedRows returns empty effective state for missing ids after recompute', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'id',
                            topIds: ['ROW-MISSING-1'],
                            bottomIds: ['ROW-MISSING-2']
                        }
                    }
                }
            });

            return {
                pinning: grid.rowPinning.getPinnedRows(),
                topRows: grid.viewport.rowPinningView.getRows('top').length,
                bottomRows: grid.viewport.rowPinningView.getRows('bottom').length
            };
        });

        expect(state.pinning.topIds).toEqual([]);
        expect(state.pinning.bottomIds).toEqual([]);
        expect(state.topRows).toBe(0);
        expect(state.bottomRows).toBe(0);
    });

    test('keeps focus continuity when a focused row is pinned and unpinned', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getActiveRowId = (): string | undefined => {
                const active = document.activeElement as HTMLElement | null;
                if (!active) {
                    return;
                }
                const row = active.closest('tr');
                if (!row) {
                    return;
                }
                const idCell = row.querySelector('td[data-column-id="id"]');
                return idCell?.textContent?.trim();
            };

            const targetRowCell = grid.viewport.tbodyElement.querySelector(
                'tr[data-row-index="5"] td[data-column-id="product"]'
            ) as HTMLElement | null;
            targetRowCell?.focus();
            const before = getActiveRowId();

            await grid.rowPinning.pin('ROW-006', 'top');
            await new Promise((resolve) => setTimeout(resolve, 0));
            const afterPin = getActiveRowId();

            await grid.rowPinning.unpin('ROW-006');
            await new Promise((resolve) => setTimeout(resolve, 0));
            const afterUnpin = getActiveRowId();

            return {
                before,
                afterPin,
                afterUnpin
            };
        });

        expect(state.before).toBe('ROW-006');
        expect(state.afterPin).toBe('ROW-006');
        expect(state.afterUnpin).toBe('ROW-006');
    });

    test('treats numeric and string row ids deterministically', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                dataTable: {
                    columns: {
                        id: [1, 2, 3],
                        product: ['A', 'B', 'C'],
                        group: ['X', 'Y', 'Z'],
                        stock: [10, 20, 30]
                    }
                },
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'id',
                            topIds: ['1'],
                            bottomIds: []
                        }
                    }
                }
            });

            const stringPinned = grid.rowPinning.getPinnedRows();
            await grid.rowPinning.pin(1, 'top');
            const numericPinned = grid.rowPinning.getPinnedRows();

            return {
                stringPinned,
                numericPinned
            };
        });

        expect(state.stringPinned.topIds).toEqual([]);
        expect(state.numericPinned.topIds).toEqual([1]);
    });

});
