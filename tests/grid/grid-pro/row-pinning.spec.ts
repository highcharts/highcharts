import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro row pinning', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/row-pinning');

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

        const scrollRowCell = page.locator(
            'tbody.hcg-tbody-scrollable tr[data-row-index="5"] td[data-column-id="id"]'
        );
        await expect(scrollRowCell).toBeVisible();

        await scrollRowCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Pin row to top' }).click();

        await expect(page.locator('#pinnedTop')).toHaveValue('ROW-001,ROW-006');

        const pinnedTopCell = page.locator(
            'tbody.hcg-tbody-pinned-top td[data-column-id="id"]',
            { hasText: 'ROW-006' }
        );
        await expect(pinnedTopCell).toBeVisible();

        await expect(page.locator(
            'tbody.hcg-tbody-scrollable td[data-column-id="id"]',
            { hasText: 'ROW-006' }
        )).toHaveCount(0);

        await pinnedTopCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Unpin row' }).click();

        await expect(page.locator('#pinnedTop')).toHaveValue('ROW-001');
    });

    test('Virtualization threshold uses scrollable rows with pinning', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const rowIds = Array.from({ length: 45 }, (_, i) => (
                'ROW-' + String(i + 1).padStart(3, '0')
            ));

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: rowIds,
                            bottom: ['ROW-060']
                        }
                    }
                }
            });

            const afterLargePinned = {
                virtualRows: grid.viewport.virtualRows,
                scrollableRows: grid.rowPinningMeta?.scrollableCount
            };

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: rowIds.slice(0, 20),
                            bottom: ['ROW-060']
                        }
                    }
                }
            });

            return {
                afterLargePinned,
                afterReducedPinned: {
                    virtualRows: grid.viewport.virtualRows,
                    scrollableRows: grid.rowPinningMeta?.scrollableCount
                }
            };
        });

        expect(state.afterLargePinned.scrollableRows).toBe(14);
        expect(state.afterLargePinned.virtualRows).toBe(false);

        expect(state.afterReducedPinned.scrollableRows).toBe(39);
        expect(state.afterReducedPinned.virtualRows).toBe(true);
    });

    test('Updates pinned rows when membership changes at same counts', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: ['ROW-001'],
                            bottom: ['ROW-060']
                        }
                    }
                }
            });

            const before = Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => el.textContent?.trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: ['ROW-010'],
                            bottom: ['ROW-060']
                        }
                    }
                }
            });

            const after = Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => el.textContent?.trim());

            return { before, after };
        });

        expect(state.before).toEqual(['ROW-001']);
        expect(state.after).toEqual(['ROW-010']);
    });

    test('Supports pinned max heights in px and percentage', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const topTbody = grid.viewport.pinnedTopTbodyElement;
            const bottomTbody = grid.viewport.pinnedBottomTbodyElement;
            const rowIds = Array.from({ length: 20 }, (_, i) => (
                'ROW-' + String(i + 1).padStart(3, '0')
            ));

            const initialState = {
                maxHeight: topTbody.style.maxHeight,
                overflowY: topTbody.style.overflowY,
                bottomMaxHeight: bottomTbody.style.maxHeight
            };

            await Promise.all(
                rowIds.map((rowId) => grid.pinRow(rowId, 'top'))
            );

            const overflowState = {
                maxHeight: topTbody.style.maxHeight,
                overflowY: topTbody.style.overflowY,
                hasOverflow: topTbody.scrollHeight > topTbody.clientHeight
            };

            return {
                initialState,
                overflowState
            };
        });

        expect(state.initialState.maxHeight).toBe('80px');
        expect(state.initialState.overflowY).toBe('auto');
        expect(state.initialState.bottomMaxHeight.endsWith('px')).toBe(true);

        expect(state.overflowState.maxHeight).toBe('80px');
        expect(state.overflowState.overflowY).toBe('auto');
        expect(state.overflowState.hasOverflow).toBe(true);
    });

    test('Sorting and filtering include/exclude matrix behaves as expected', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            const getPinnedTopIds = (): string[] => Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            const runCase = async (
                sortingMode: 'include'|'exclude',
                filteringMode: 'include'|'exclude'
            ) => {
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
                            pinned: {
                                top: ['ROW-003', 'ROW-001'],
                                bottom: ['ROW-060'],
                                sorting: sortingMode,
                                filtering: filteringMode
                            }
                        }
                    }
                });

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

                return getPinnedTopIds();
            };

            return {
                excludeExclude: await runCase('exclude', 'exclude'),
                includeExclude: await runCase('include', 'exclude'),
                excludeInclude: await runCase('exclude', 'include'),
                includeInclude: await runCase('include', 'include')
            };
        });

        expect(state.excludeExclude).toEqual(['ROW-003', 'ROW-001']);
        expect(state.includeExclude).toEqual(['ROW-001', 'ROW-003']);
        expect(state.excludeInclude).toEqual([]);
        expect(state.includeInclude).toEqual([]);
    });

    test('scrollToRow is safe with pinning in non-virtual mode', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: false,
                        pinned: {
                            top: ['ROW-001', 'ROW-002', 'ROW-003'],
                            bottom: ['ROW-060']
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
                        pinned: {
                            top: ['ROW-001', 'ROW-002'],
                            bottom: ['ROW-060']
                        }
                    }
                }
            });
        });

        const firstPinnedCell = page.locator(
            'tbody.hcg-tbody-pinned-top tr[data-row-index="0"] td[data-column-id="id"]'
        );
        await firstPinnedCell.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'ROW-003');

        await page.keyboard.press('ArrowUp');
        await expect(page.locator(':focus')).toHaveAttribute('data-value', 'ROW-002');
    });

    test('aria-rowindex order is monotonic across rendered pinned sections', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: ['ROW-001', 'ROW-002'],
                            bottom: ['ROW-059', 'ROW-060']
                        }
                    }
                }
            });

            const rows = Array.from(
                document.querySelectorAll(
                    'tbody.hcg-tbody-pinned-top tr,' +
                    'tbody.hcg-tbody-scrollable tr,' +
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
                'tbody.hcg-tbody-scrollable tr'
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

    test('Pinned and main sections stay right-edge aligned with mixed scrollbars', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const rowIds = Array.from({ length: 15 }, (_, i) => (
                'ROW-' + String(i + 1).padStart(3, '0')
            ));

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: rowIds,
                            bottom: ['ROW-060'],
                            maxTopHeight: 80,
                            maxBottomHeight: 80
                        }
                    }
                }
            });

            const getRight = (selector: string): number => {
                const el = document.querySelector<HTMLElement>(selector);
                return el ? el.getBoundingClientRect().right : -1;
            };

            const headerRight = getRight('thead th:last-child');
            const pinnedTopRight = getRight(
                'tbody.hcg-tbody-pinned-top td:last-child'
            );
            const scrollRight = getRight(
                'tbody.hcg-tbody-scrollable td:last-child'
            );
            const pinnedBottomRight = getRight(
                'tbody.hcg-tbody-pinned-bottom td:last-child'
            );

            return {
                headerRight,
                pinnedTopRight,
                scrollRight,
                pinnedBottomRight
            };
        });

        expect(Math.abs(
            state.scrollRight - state.pinnedTopRight
        )).toBeLessThanOrEqual(1);
        expect(Math.abs(
            state.scrollRight - state.pinnedBottomRight
        )).toBeLessThanOrEqual(1);
        expect(Math.abs(
            state.headerRight - state.scrollRight
        )).toBeLessThanOrEqual(1);
    });

    test('Pinned rows stay visible across pagination pages', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const collectIds = (selector: string): string[] => Array.from(
                document.querySelectorAll(selector)
            ).map((el): string => (el.textContent || '').trim());

            await grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            });

            await grid.pinRow('ROW-025', 'top');

            const page1 = {
                pinnedTop: collectIds(
                    'tbody.hcg-tbody-pinned-top td[data-column-id="id"]'
                ),
                scrollable: collectIds(
                    'tbody.hcg-tbody-scrollable td[data-column-id="id"]'
                )
            };

            await grid.update({
                pagination: {
                    page: 3
                }
            });

            const page3 = {
                pinnedTop: collectIds(
                    'tbody.hcg-tbody-pinned-top td[data-column-id="id"]'
                ),
                scrollable: collectIds(
                    'tbody.hcg-tbody-scrollable td[data-column-id="id"]'
                )
            };

            return { page1, page3 };
        });

        expect(state.page1.pinnedTop).toContain('ROW-025');
        expect(state.page3.pinnedTop).toContain('ROW-025');
        expect(state.page1.scrollable).not.toContain('ROW-025');
        expect(state.page3.scrollable).not.toContain('ROW-025');
    });

    test('Pagination pageSize applies to scrollable rows only', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;

            await grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                },
                rendering: {
                    rows: {
                        virtualization: false,
                        pinned: {
                            top: ['ROW-001', 'ROW-002'],
                            bottom: ['ROW-060']
                        }
                    }
                }
            });

            return {
                topCount: grid.viewport.pinnedTopRows.length,
                scrollableCount: grid.viewport.rows.length,
                bottomCount: grid.viewport.pinnedBottomRows.length
            };
        });

        expect(state.topCount).toBe(2);
        expect(state.scrollableCount).toBe(10);
        expect(state.bottomCount).toBe(1);
    });

    test('Non-virtual sorting include reorders pinned rows', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const getScrollableIds = (): string[] => Array.from(
                grid.viewport.tbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: false,
                        pinned: {
                            top: ['ROW-003', 'ROW-001'],
                            bottom: ['ROW-060'],
                            sorting: 'include',
                            filtering: 'exclude'
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

        expect(state.pinnedTop).toEqual(['ROW-001', 'ROW-003']);
        expect(state.scrollable).not.toContain('ROW-001');
        expect(state.scrollable).not.toContain('ROW-003');
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
            await grid.pinRow('ROW-012', 'top');
            const afterPin = activePage();
            await grid.unpinRow('ROW-012');
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

    test('pinRow supports insertion index within pinned collection', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: ['ROW-001', 'ROW-002']
                        }
                    }
                }
            });

            await grid.pinRow('ROW-010', 'top', 0);
            const afterFirstInsert = getPinnedTopIds();

            await grid.pinRow('ROW-011', 'top', 1);
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

    test('resolve pinning remains disabled after explicit unpin', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        pinned: {
                            top: [],
                            bottom: [],
                            resolve: (row: Record<string, unknown>) => (
                                row.id === 'ROW-001' ? 'top' : null
                            )
                        }
                    }
                }
            });

            const beforeUnpin = getPinnedTopIds();
            await grid.unpinRow('ROW-001');

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
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            let error: string | undefined;
            try {
                await grid.update({
                    rendering: {
                        rows: {
                            pinned: {
                                top: [],
                                bottom: [],
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
                        pinned: {
                            top: ['ROW-001'],
                            bottom: ['ROW-060']
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

    test('Pinned rows work with explicit virtualization true', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const getPinnedTopIds = (): string[] => Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const getScrollableIds = (): string[] => Array.from(
                grid.viewport.tbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: true,
                        pinned: {
                            top: ['ROW-001', 'ROW-002'],
                            bottom: ['ROW-060']
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
        expect(state.scrollable).not.toContain('ROW-001');
        expect(state.scrollable).not.toContain('ROW-002');
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
                            rowIdColumn: 'id',
                            pinned: {
                                top: ['ROW-001'],
                                bottom: ['ROW-060']
                            }
                        }
                    }
                });
            } catch (e) {
                error = String(e);
            }

            return {
                error,
                topRows: grid.viewport.pinnedTopRows.length,
                bottomRows: grid.viewport.pinnedBottomRows.length,
                scrollableRows: grid.viewport.rows.length
            };
        });

        expect(state.error).toBeUndefined();
        expect(state.topRows).toBe(0);
        expect(state.bottomRows).toBe(0);
        expect(state.scrollableRows).toBe(0);
    });

    test('All rows pinned collapses empty scrollable area', async ({ page }) => {
        const state = await page.evaluate(async () => {
            const grid = (window as any).grid;
            const allIds = Array.from({ length: 60 }, (_, i) => (
                'ROW-' + String(i + 1).padStart(3, '0')
            ));

            await grid.update({
                rendering: {
                    rows: {
                        virtualization: false,
                        pinned: {
                            top: allIds,
                            bottom: []
                        }
                    }
                }
            });

            return {
                scrollableDisplay: grid.viewport.tbodyElement.style.display,
                scrollableRows: grid.viewport.rows.length,
                scrollableCount: grid.rowPinningMeta?.scrollableCount || 0,
                topRows: grid.viewport.pinnedTopRows.length
            };
        });

        expect(state.scrollableDisplay).toBe('none');
        expect(state.scrollableRows).toBe(0);
        expect(state.scrollableCount).toBe(0);
        expect(state.topRows).toBe(60);
    });

});
