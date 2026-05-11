import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

async function loadGridPro(page: Page): Promise<void> {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css">
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });
}

async function getVisibleRowIds(page: Page): Promise<Array<string | null>> {
    return page.locator('tbody .hcg-row').evaluateAll((rows): Array<string | null> =>
        rows.map((row): string | null => row.getAttribute('data-row-id'))
    );
}

async function getTreeColumnValues(
    page: Page,
    columnId: string
): Promise<string[]> {
    return page
        .locator(
            `tbody .hcg-row td[data-column-id="${columnId}"] ` +
            '.hcg-tree-value'
        )
        .evaluateAll((elements): string[] =>
            elements.map((element): string => element.textContent || '')
        );
}

async function constrainGridBodyHeight(
    page: Page,
    height: number
): Promise<void> {
    await page.evaluate((bodyHeight): void => {
        const grid = (window as any).grid;
        const tbody = grid?.viewport?.tbodyElement as HTMLElement | undefined;

        if (!tbody) {
            return;
        }

        tbody.style.height = `${bodyHeight}px`;
        tbody.style.maxHeight = `${bodyHeight}px`;
        grid.viewport.reflow();
    }, height);
}

async function getRenderedTreeRowTop(
    page: Page,
    rowId: string
): Promise<number | null> {
    return page.evaluate((targetRowId): number | null => {
        const row = (
            document.querySelector<HTMLTableRowElement>(
                `.hcg-tbody-sticky tr[data-row-id="${targetRowId}"]`
            ) ||
            document.querySelector<HTMLTableRowElement>(
                `table > tbody:not(.hcg-tbody-sticky) tr[data-row-id="${targetRowId}"]`
            )
        );

        return row?.getBoundingClientRect().top ?? null;
    }, rowId);
}

function requireRowTop(top: number | null): number {
    if (top === null) {
        throw new Error('Expected rendered tree row to stay visible.');
    }

    return top;
}

test.describe('Grid Pro - tree view', () => {
    test('projects parentId rows and toggles nested children', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2, 3, 4],
                        parentId: [null, 1, 1, 2],
                        name: ['Root', 'Sales', 'Marketing', 'EMEA']
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(1);
        expect(await getVisibleRowIds(page)).toStrictEqual(['1']);

        await page.locator('[data-hcg-tree-toggle]').first().click();
        await expect(page.locator('tbody .hcg-row')).toHaveCount(3);
        expect(await getVisibleRowIds(page)).toStrictEqual(['1', '2', '3']);

        await page.locator('[data-hcg-tree-toggle]').nth(1).click();
        await expect(page.locator('tbody .hcg-row')).toHaveCount(4);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '1',
            '2',
            '4',
            '3'
        ]);
    });

    test('seeds explicit expandedRowIds without expanding every branch', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2, 3, 4],
                        parentId: [null, 1, 1, 2],
                        name: ['Root', 'Sales', 'Marketing', 'EMEA']
                    },
                    idColumn: 'id',
                    treeView: {
                        expandedRowIds: [1],
                        treeColumn: 'name'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(3);
        expect(await getVisibleRowIds(page)).toStrictEqual(['1', '2', '3']);
        await expect(page.locator('[data-hcg-tree-toggle]').nth(1))
            .toHaveAttribute('aria-expanded', 'false');
    });

    test('detects path input from dataset when treeView.input is omitted', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2, 3],
                        path: ['A/a', 'A/b', 'B/c'],
                        name: ['a', 'b', 'c']
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(5);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:A',
            '1',
            '2',
            '__hcg_tree_path__:B',
            '3'
        ]);
    });

    test('prefers path input when both dataset columns exist', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2, 3],
                        parentId: [null, 1, 1],
                        path: ['A/a', 'A/b', 'B/c'],
                        name: ['a', 'b', 'c']
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(5);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:A',
            '1',
            '2',
            '__hcg_tree_path__:B',
            '3'
        ]);
    });

    test('keeps generated path parents addressable after pagination', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2],
                        path: ['A/a', 'B/b'],
                        name: ['a', 'b']
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path'
                        },
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                pagination: {
                    enabled: true,
                    pageSize: 2
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);

            await (window as any).grid.pagination.goToPage(2);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(2);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:B',
            '2'
        ]);

        await page.locator('[data-hcg-tree-toggle]').first().click();

        await expect(page.locator('tbody .hcg-row')).toHaveCount(1);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:B'
        ]);
        await expect(page.locator('[data-hcg-tree-toggle]'))
            .toHaveAttribute('aria-expanded', 'false');
    });

    test('parses path input with a separator callback', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2],
                        path: ['AaaBbbCcc', 'AaaBbbDdd'],
                        name: ['Ccc', 'Ddd']
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path',
                            separator: (path: string): string[] =>
                                path.match(
                                    /[A-Z]+(?![a-z])|[A-Z][a-z]*/g
                                ) || []
                        },
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(4);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:Aaa',
            '__hcg_tree_path__:AaaBbb',
            '1',
            '2'
        ]);
    });

    test('renders path tree column values as current path segments', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2, 3],
                        path: [
                            'Sales/EMEA',
                            'Marketing/Demand Gen/ABM',
                            'Engineering/Frontend/Platform'
                        ]
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path',
                            showFullPath: false
                        },
                        treeColumn: 'path',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(8);
        expect(await getTreeColumnValues(page, 'path')).toStrictEqual([
            'Sales',
            'EMEA',
            'Marketing',
            'Demand Gen',
            'ABM',
            'Engineering',
            'Frontend',
            'Platform'
        ]);
        await expect(
            page.locator('tr[data-row-id="2"] td[data-column-id="path"]')
        ).toHaveAttribute('data-value', 'Marketing/Demand Gen/ABM');
    });

    test('parses path input with a separator regexp', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: [1, 2],
                        path: ['AaaBbbCcc', 'AaaBbbDdd'],
                        name: ['Ccc', 'Ddd']
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path',
                            separator: /[A-Z]+(?![a-z])|[A-Z][a-z]*/
                        },
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await expect(page.locator('tbody .hcg-row')).toHaveCount(4);
        expect(await getVisibleRowIds(page)).toStrictEqual([
            '__hcg_tree_path__:Aaa',
            '__hcg_tree_path__:AaaBbb',
            '1',
            '2'
        ]);
    });

    test('preserves focus when a focused tree cell becomes sticky', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            const container = document.getElementById('container');
            const rowCount = 20;
            const ids = Array.from(
                { length: rowCount },
                (_, i): number => i + 1
            );

            if (!container) {
                return;
            }

            container.style.width = '420px';

            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ids,
                        parentId: ids.map(
                            (id): (number|null) => id === 1 ? null : 1
                        ),
                        name: ids.map(
                            (id): string => id === 1 ? 'Root' : `Child ${id - 1}`
                        )
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await constrainGridBodyHeight(page, 200);

        const rootCell = page.locator(
            'tr[data-row-id="1"] td[data-column-id="name"]'
        );
        const mainBody = page.locator(
            'table > tbody:not(.hcg-tbody-sticky)'
        );
        const stickyCell = page.locator(
            '.hcg-tbody-sticky tr[data-row-id="1"] td[data-column-id="name"]'
        );

        await rootCell.focus();
        await expect(rootCell).toBeFocused();
        await expect.poll(async () => mainBody.evaluate(
            (tbody): boolean =>
                (tbody as HTMLElement).scrollHeight >
                (tbody as HTMLElement).clientHeight
        )).toBe(true);

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 150;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect(stickyCell).toBeVisible();
        await expect(stickyCell).toBeFocused();

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 260;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect(stickyCell).toBeFocused();
    });

    test('restores focus when a virtualized tree cell re-enters the render window', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            const container = document.getElementById('container');
            const rowCount = 100;
            const ids = Array.from(
                { length: rowCount },
                (_, i): number => i + 1
            );

            if (!container) {
                return;
            }

            container.style.width = '420px';

            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ids,
                        parentId: ids.map(
                            (id): (number|null) => id === 1 ? null : 1
                        ),
                        name: ids.map(
                            (id): string => id === 1 ? 'Root' : `Child ${id - 1}`
                        )
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            }, true);
        });

        await constrainGridBodyHeight(page, 200);

        const mainBody = page.locator(
            'table > tbody:not(.hcg-tbody-sticky)'
        );
        const targetCell = page.locator(
            'tr[data-row-id="5"] td[data-column-id="name"]'
        );

        await expect.poll(async () => mainBody.evaluate(
            (tbody): boolean =>
                (tbody as HTMLElement).scrollHeight >
                (tbody as HTMLElement).clientHeight
        )).toBe(true);

        await targetCell.focus();
        await expect(targetCell).toBeFocused();

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 2000;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect.poll(async () => targetCell.count()).toBe(0);

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 150;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect(targetCell).toBeVisible();
        await expect(targetCell).toBeFocused();
    });

    test('keyboard navigation scrolls when focus moves past visible body edge', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            const container = document.getElementById('container');
            const rowCount = 100;
            const ids = Array.from(
                { length: rowCount },
                (_, i): number => i + 1
            );

            if (!container) {
                return;
            }

            container.style.width = '420px';

            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ids,
                        parentId: ids.map(
                            (id): (number|null) => id === 1 ? null : 1
                        ),
                        name: ids.map(
                            (id): string => id === 1 ? 'Root' : `Child ${id - 1}`
                        )
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            }, true);
        });

        await constrainGridBodyHeight(page, 120);

        const targetIndex = await page.evaluate((): number => {
            const grid = (window as any).grid;
            const tbody = grid.viewport.tbodyElement as HTMLElement;

            tbody.scrollTop = 0;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));

            const bodyRect = tbody.getBoundingClientRect();
            const rows = Array.from(
                tbody.querySelectorAll<HTMLTableRowElement>(
                    'tr[data-row-index]'
                )
            );

            for (let i = 1, iEnd = rows.length; i < iEnd; ++i) {
                const previousRow = rows[i - 1];
                const targetRow = rows[i];
                const previousIndex = Number(
                    previousRow.getAttribute('data-row-index')
                );
                const currentIndex = Number(
                    targetRow.getAttribute('data-row-index')
                );

                if (
                    currentIndex === previousIndex + 1 &&
                    targetRow.getBoundingClientRect().top >= bodyRect.bottom
                ) {
                    previousRow
                        .querySelector<HTMLElement>('[data-column-id="name"]')
                        ?.focus();

                    return currentIndex;
                }
            }

            throw new Error('Unable to find a rendered row below the viewport.');
        });

        const mainBody = page.locator(
            'table > tbody:not(.hcg-tbody-sticky)'
        );
        const scrollTopBefore = await mainBody.evaluate(
            (tbody): number => (tbody as HTMLElement).scrollTop
        );

        await page.keyboard.press('ArrowDown');

        await expect.poll(async () => mainBody.evaluate(
            (tbody): number => (tbody as HTMLElement).scrollTop
        )).toBeGreaterThan(scrollTopBefore);
        await expect(page.locator(':focus').locator('..')).toHaveAttribute(
            'data-row-index',
            String(targetIndex)
        );
    });

    test('does not restore detached focus after focusing outside the grid', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            const container = document.getElementById('container');
            const outsideButton = document.createElement('button');
            const rowCount = 100;
            const ids = Array.from(
                { length: rowCount },
                (_, i): number => i + 1
            );

            outsideButton.id = 'outside-focus-target';
            outsideButton.textContent = 'Outside';
            document.body.appendChild(outsideButton);

            if (!container) {
                return;
            }

            container.style.width = '420px';

            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ids,
                        parentId: ids.map(
                            (id): (number|null) => id === 1 ? null : 1
                        ),
                        name: ids.map(
                            (id): string => id === 1 ? 'Root' : `Child ${id - 1}`
                        )
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: true
                    }
                }
            }, true);
        });

        await constrainGridBodyHeight(page, 200);

        const mainBody = page.locator(
            'table > tbody:not(.hcg-tbody-sticky)'
        );
        const targetCell = page.locator(
            'tr[data-row-id="5"] td[data-column-id="name"]'
        );
        const outsideButton = page.locator('#outside-focus-target');

        await expect.poll(async () => mainBody.evaluate(
            (tbody): boolean =>
                (tbody as HTMLElement).scrollHeight >
                (tbody as HTMLElement).clientHeight
        )).toBe(true);

        await targetCell.focus();
        await expect(targetCell).toBeFocused();

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 2000;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect.poll(async () => targetCell.count()).toBe(0);

        await outsideButton.click();
        await expect(outsideButton).toBeFocused();

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 150;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect(targetCell).toBeVisible();
        await expect(targetCell).not.toBeFocused();
    });

    test('keeps collapsed sticky parent anchored in place', async ({ page }) => {
        await loadGridPro(page);

        await page.evaluate(async (): Promise<void> => {
            const container = document.getElementById('container');
            const rowCount = 20;
            const ids = Array.from(
                { length: rowCount },
                (_, i): number => i + 1
            );

            if (!container) {
                return;
            }

            container.style.width = '420px';

            (window as any).grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ids,
                        parentId: ids.map(
                            (id): (number|null) => id === 1 ? null : 1
                        ),
                        name: ids.map(
                            (id): string => id === 1 ? 'Root' : `Child ${id - 1}`
                        )
                    },
                    idColumn: 'id',
                    treeView: {
                        treeColumn: 'name',
                        expandedRowIds: 'all'
                    }
                },
                rendering: {
                    rows: {
                        virtualization: false
                    }
                }
            }, true);
        });

        await constrainGridBodyHeight(page, 200);

        const mainBody = page.locator(
            'table > tbody:not(.hcg-tbody-sticky)'
        );
        const stickyToggleButton = page.locator(
            '.hcg-tbody-sticky tr[data-row-id="1"] [data-hcg-tree-toggle]'
        );

        await expect.poll(async () => mainBody.evaluate(
            (tbody): boolean =>
                (tbody as HTMLElement).scrollHeight >
                (tbody as HTMLElement).clientHeight
        )).toBe(true);

        await mainBody.evaluate((tbody): void => {
            (tbody as HTMLElement).scrollTop = 150;
            tbody.dispatchEvent(new Event('scroll', { bubbles: true }));
        });

        await expect(stickyToggleButton).toBeVisible();

        const topBeforeCollapse = await getRenderedTreeRowTop(page, '1');

        await stickyToggleButton.click();

        await expect(page.locator('tbody .hcg-row')).toHaveCount(1);

        const topAfterCollapse = await getRenderedTreeRowTop(page, '1');

        expect(topBeforeCollapse).not.toBeNull();
        expect(topAfterCollapse).not.toBeNull();

        expect(
            Math.abs(
                requireRowTop(topAfterCollapse) -
                requireRowTop(topBeforeCollapse)
            )
        ).toBeLessThan(2);
    });
});
