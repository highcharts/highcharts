import { test, expect } from '~/fixtures.ts';

/**
 * Builds a grid with row selection enabled. `options` is merged into the
 * `rowSelection` option group.
 */
async function setupGrid(
    page: any,
    rowSelection: Record<string, any> = {}
): Promise<void> {
    await page.goto('/grid-pro/basic/overview');

    await page.evaluate((selectionOptions: Record<string, any>) => {
        const rowCount = 60;
        const rows = Array.from({ length: rowCount }, (_, i) => ({
            id: 'ROW-' + String(i + 1).padStart(3, '0'),
            product: 'Product ' + (i + 1),
            // Strictly increasing, so sorting order is predictable.
            stock: i
        }));

        document.body.innerHTML = `
            <div id="container" style="height: 320px;"></div>
            <input id="selected" type="text" aria-label="selected" readonly />
        `;

        const output = document.getElementById(
            'selected'
        ) as HTMLInputElement | null;

        const grid = (window as any).Grid.grid('container', {
            data: {
                columns: {
                    id: rows.map((row) => row.id),
                    product: rows.map((row) => row.product),
                    stock: rows.map((row) => row.stock)
                },
                idColumn: 'id'
            },
            columns: [{ id: 'id', enabled: false }],
            rendering: {
                rows: {
                    virtualizationThreshold: 20
                }
            },
            rowSelection: Object.assign({
                enabled: true,
                mode: 'multiple',
                checkbox: { enabled: true }
            }, selectionOptions),
            events: {
                afterRowSelectionChange: function (e: any): void {
                    if (output) {
                        output.value = e.selectedRowIds.join(',');
                    }
                }
            }
        });

        (window as any).grid = grid;
    }, rowSelection);

    await page.waitForFunction(
        () => typeof (window as any).grid?.rowSelection !== 'undefined'
    );
    await page.waitForFunction(
        () => document.querySelectorAll('tbody td').length > 0
    );
}

/**
 * Reads the selected row ids straight from the public API.
 */
function selectedIds(page: any): Promise<string[]> {
    return page.evaluate(
        () => (window as any).grid.rowSelection.getSelectedRowIds()
    );
}

/**
 * A body cell of the given row, outside the selection column.
 */
function productCell(page: any, rowIndex: number) {
    return page.locator(
        `tbody:not(.hcg-tbody-pinned) tr[data-row-index="${rowIndex}"] ` +
        'td[data-column-id="product"]'
    );
}

test.describe('Grid Pro row selection', () => {
    test('Single mode selects one row and deselects it on a second click',
        async ({ page }) => {
            await setupGrid(page, { mode: 'single' });

            await productCell(page, 1).click();
            expect(await selectedIds(page)).toEqual(['ROW-002']);

            await productCell(page, 3).click();
            expect(await selectedIds(page)).toEqual(['ROW-004']);

            await productCell(page, 3).click();
            expect(await selectedIds(page)).toEqual([]);
        });

    test('Multiple mode toggles rows with plain clicks',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 0).click();
            await productCell(page, 2).click();
            expect(await selectedIds(page)).toEqual(['ROW-001', 'ROW-003']);

            await productCell(page, 0).click();
            expect(await selectedIds(page)).toEqual(['ROW-003']);
        });

    test('Shift-click selects a continuous range', async ({ page }) => {
        await setupGrid(page);

        await productCell(page, 1).click();
        await productCell(page, 4).click({ modifiers: ['Shift'] });

        expect(await selectedIds(page)).toEqual([
            'ROW-002', 'ROW-003', 'ROW-004', 'ROW-005'
        ]);
    });

    test('With clickBehavior replace, a plain click replaces and the ' +
        'modifier adds', async ({ page }) => {
        await setupGrid(page, { clickBehavior: 'replace' });

        await productCell(page, 0).click();
        await productCell(page, 2).click();
        expect(await selectedIds(page)).toEqual(['ROW-003']);

        await productCell(page, 4).click({
            modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control']
        });
        expect(await selectedIds(page)).toEqual(['ROW-003', 'ROW-005']);
    });

    test('Hovering a selected row does not wipe the selection highlight',
        async ({ page }) => {
            await setupGrid(page);
            await productCell(page, 0).click();

            const background = (rowIndex: number): Promise<string> =>
                page.locator(
                    'tbody:not(.hcg-tbody-pinned) ' +
                    `tr[data-row-index="${rowIndex}"] ` +
                    'td[data-column-id="product"]'
                ).evaluate((el) => getComputedStyle(el).backgroundColor);

            // The click leaves the pointer on the cell, so park it off the
            // table before reading the unhovered baseline.
            await page.mouse.move(0, 0);
            const selected = await background(0);
            const plain = await background(1);
            expect(selected).not.toBe(plain);

            // The cell hover rule is one pseudo-class more specific than the
            // selected rule, so it can only be composed with, not outranked.
            await productCell(page, 0).hover();
            expect(await background(0)).toBe(selected);

            // A row that is not selected still gets its hover feedback.
            await productCell(page, 1).hover();
            expect(await background(1)).not.toBe(plain);
        });

    test('Selected rows are highlighted and their checkbox is checked',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 2).click();

            const row = page.locator(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="2"]'
            );
            await expect(row).toHaveClass(/hcg-row-selected/);
            await expect(row).toHaveAttribute('aria-selected', 'true');
            await expect(
                row.locator('.hcg-selection-checkbox')
            ).toBeChecked();

            const other = page.locator(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="3"]'
            );
            await expect(other).not.toHaveClass(/hcg-row-selected/);
            await expect(
                other.locator('.hcg-selection-checkbox')
            ).not.toBeChecked();
        });

    test('Table advertises multi-selection to assistive technology',
        async ({ page }) => {
            await setupGrid(page);
            await expect(page.locator('table.hcg-table')).toHaveAttribute(
                'aria-multiselectable', 'true'
            );

            await setupGrid(page, { mode: 'single' });
            await expect(page.locator('table.hcg-table')).toHaveAttribute(
                'aria-multiselectable', 'false'
            );
        });

    test('trigger checkbox ignores row clicks but keeps checkbox clicks',
        async ({ page }) => {
            await setupGrid(page, { trigger: 'checkbox' });

            await productCell(page, 1).click();
            expect(await selectedIds(page)).toEqual([]);

            await page.locator(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="1"] ' +
                '.hcg-selection-checkbox'
            ).click();
            expect(await selectedIds(page)).toEqual(['ROW-002']);
        });

    test('trigger row turns the checkbox into a plain indicator',
        async ({ page }) => {
            await setupGrid(page, { trigger: 'row' });

            const checkbox = page.locator(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="1"] ' +
                '.hcg-selection-checkbox'
            );

            await expect(checkbox).toHaveClass(
                /hcg-selection-checkbox-readonly/
            );
            await expect(checkbox).toHaveAttribute('aria-hidden', 'true');
            expect(await checkbox.evaluate(
                (el) => getComputedStyle(el).pointerEvents
            )).toBe('none');

            // The checkbox must not be a dead spot: a real click landing on
            // it hit-tests through to the row, exactly like a click anywhere
            // else on that row. Clicking by coordinate rather than through
            // the locator, so the browser does the hit-testing.
            const box = (await checkbox.boundingBox())!;
            const clickCheckbox = async (): Promise<void> => {
                await page.mouse.click(
                    box.x + box.width / 2,
                    box.y + box.height / 2
                );
            };

            await clickCheckbox();
            expect(await selectedIds(page)).toEqual(['ROW-002']);
            await expect(checkbox).toBeChecked();

            await clickCheckbox();
            expect(await selectedIds(page)).toEqual([]);
            await expect(checkbox).not.toBeChecked();
        });

    test('trigger both keeps the checkbox operable', async ({ page }) => {
        await setupGrid(page);

        const checkbox = page.locator(
            'tbody:not(.hcg-tbody-pinned) tr[data-row-index="1"] ' +
            '.hcg-selection-checkbox'
        );

        await expect(checkbox).not.toHaveClass(
            /hcg-selection-checkbox-readonly/
        );
        await expect(checkbox).not.toHaveAttribute('aria-hidden', 'true');
        expect(await checkbox.evaluate(
            (el) => getComputedStyle(el).pointerEvents
        )).not.toBe('none');
    });

    test('Space selects the focused row, Enter does not', async ({ page }) => {
        await setupGrid(page);

        await productCell(page, 1).click();
        expect(await selectedIds(page)).toEqual(['ROW-002']);

        await productCell(page, 3).focus();
        await page.keyboard.press(' ');
        expect(await selectedIds(page)).toEqual(['ROW-002', 'ROW-004']);

        await productCell(page, 5).focus();
        await page.keyboard.press('Enter');
        expect(await selectedIds(page)).toEqual(['ROW-002', 'ROW-004']);
    });

    test('Selection survives scrolling a virtualized grid past the row pool',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 1).click();
            await productCell(page, 3).click({ modifiers: ['Shift'] });
            expect(await selectedIds(page)).toEqual([
                'ROW-002', 'ROW-003', 'ROW-004'
            ]);

            await page.evaluate(() => {
                (window as any).grid.viewport.tbodyElement.scrollTop = 1600;
            });
            await page.waitForFunction(() => !document.querySelector(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="2"]'
            ));

            // Nothing rendered in the far window may claim to be selected.
            expect(await page.locator(
                'tbody:not(.hcg-tbody-pinned) tr.hcg-row-selected'
            ).count()).toBe(0);

            await page.evaluate(() => {
                (window as any).grid.viewport.tbodyElement.scrollTop = 0;
            });
            await page.waitForFunction(() => !!document.querySelector(
                'tbody:not(.hcg-tbody-pinned) tr[data-row-index="2"]'
            ));

            expect(await selectedIds(page)).toEqual([
                'ROW-002', 'ROW-003', 'ROW-004'
            ]);
            await expect(page.locator(
                'tbody:not(.hcg-tbody-pinned) tr.hcg-row-selected'
            )).toHaveCount(3);
        });

    test('Rendered state always matches the API after sorting',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 1).click();
            await productCell(page, 3).click({ modifiers: ['Shift'] });

            for (const order of ['desc', 'asc', null]) {
                await page.evaluate(async (o) => {
                    await (window as any).grid.setSorting(
                        o ? [{ columnId: 'stock', order: o }] : []
                    );
                }, order);

                const violations = await page.evaluate(() => {
                    const grid = (window as any).grid;
                    const ids = new Set(
                        grid.rowSelection.getSelectedRowIds()
                    );
                    const bad: string[] = [];

                    document.querySelectorAll(
                        'tbody:not(.hcg-tbody-pinned) tr[data-row-index]'
                    ).forEach((tr) => {
                        const id = tr.getAttribute('data-row-id');
                        const want = ids.has(id);
                        const cls = tr.classList.contains('hcg-row-selected');
                        const aria =
                            tr.getAttribute('aria-selected') === 'true';
                        const cb = tr.querySelector(
                            '.hcg-selection-checkbox'
                        ) as HTMLInputElement | null;

                        if (
                            cls !== want ||
                            aria !== want ||
                            (cb && cb.checked !== want)
                        ) {
                            bad.push(String(id));
                        }
                    });

                    return bad;
                });

                expect(violations, `order=${order}`).toEqual([]);
            }

            expect(await selectedIds(page)).toEqual([
                'ROW-002', 'ROW-003', 'ROW-004'
            ]);
        });

    test('Checkbox can be prepended to an existing column', async ({ page }) => {
        await setupGrid(page, {
            checkbox: { enabled: true, columnId: 'product' }
        });

        await expect(page.locator('.hcg-selection-cell')).toHaveCount(0);

        const cell = productCell(page, 1);
        await expect(cell.locator('.hcg-selection-checkbox')).toHaveCount(1);
        await expect(cell).toContainText('Product 2');

        await cell.locator('.hcg-selection-checkbox').click();
        expect(await selectedIds(page)).toEqual(['ROW-002']);
    });

    test('Public API selects, deselects and clears', async ({ page }) => {
        await setupGrid(page);

        await page.evaluate(() => {
            (window as any).grid.rowSelection.select(['ROW-002', 'ROW-005']);
        });
        expect(await selectedIds(page)).toEqual(['ROW-002', 'ROW-005']);
        await expect(page.locator(
            'tbody:not(.hcg-tbody-pinned) tr.hcg-row-selected'
        )).toHaveCount(2);

        await page.evaluate(() => {
            (window as any).grid.rowSelection.deselect('ROW-002');
        });
        expect(await selectedIds(page)).toEqual(['ROW-005']);

        expect(await page.evaluate(
            () => (window as any).grid.rowSelection.isSelected('ROW-005')
        )).toBe(true);

        await page.evaluate(() => {
            (window as any).grid.rowSelection.clear();
        });
        expect(await selectedIds(page)).toEqual([]);
        await expect(page.locator(
            'tbody:not(.hcg-tbody-pinned) tr.hcg-row-selected'
        )).toHaveCount(0);
    });

    test('The dedicated column aligns with a configured header without ' +
        'leaking into getOptions', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview');

        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="container" style="height: 260px;"></div>';

            (window as any).grid = (window as any).Grid.grid('container', {
                data: {
                    idColumn: 'id',
                    columns: {
                        id: ['a', 'b', 'c'],
                        name: ['A', 'B', 'C'],
                        value: [1, 2, 3]
                    }
                },
                header: ['name', 'value'],
                columns: [{ id: 'id', enabled: false }],
                rowSelection: {
                    enabled: true,
                    mode: 'multiple',
                    checkbox: { enabled: true }
                }
            });
        });

        await page.waitForFunction(
            () => document.querySelectorAll('tbody td').length > 0
        );

        // A column missing from `header` would leave the header a cell short.
        const layout = await page.evaluate(() => ({
            header: [...document.querySelectorAll('thead th')].length,
            body: [...document.querySelectorAll(
                'tbody tr[data-row-index="0"] td'
            )].length
        }));
        expect(layout.header).toBe(3);
        expect(layout.body).toBe(3);

        // Repeated updates must not inject the column twice.
        await page.evaluate(async () => {
            for (let i = 0; i < 3; i++) {
                await (window as any).grid.update({
                    rowSelection: { mode: 'multiple' }
                });
            }
        });

        expect(await page.evaluate(() => ({
            header: [...document.querySelectorAll('thead th')].length,
            body: [...document.querySelectorAll(
                'tbody tr[data-row-index="0"] td'
            )].length
        }))).toEqual({ header: 3, body: 3 });

        // The reserved column id must stay out of the user's own options.
        expect(await page.evaluate(
            () => (window as any).grid.getOptions().header
        )).toEqual(['name', 'value']);
        expect(await page.evaluate(
            () => (window as any).grid.getOptions().columns
        )).toEqual([{ id: 'id', enabled: false }]);

        await page.evaluate(() => {
            (window as any).grid.rowSelection.select(['a', 'c']);
        });
        await expect(page.locator('tr.hcg-row-selected')).toHaveCount(2);
    });

    test('A pinned mirror row reflects and toggles the selection',
        async ({ page }) => {
            await setupGrid(page);

            await page.evaluate(async () => {
                await (window as any).grid.update({
                    rendering: {
                        rows: {
                            pinning: { enabled: true, topIds: ['ROW-006'] }
                        }
                    }
                });
            });

            const mirror = page.locator('tbody.hcg-tbody-pinned-top tr');
            await expect(mirror).toHaveAttribute('data-row-id', 'ROW-006');

            await page.evaluate(() => {
                (window as any).grid.rowSelection.select('ROW-006');
            });

            await expect(mirror).toHaveClass(/hcg-row-selected/);
            await expect(
                mirror.locator('.hcg-selection-checkbox')
            ).toBeChecked();

            await mirror.locator('td[data-column-id="product"]').click();
            expect(await selectedIds(page)).toEqual([]);
        });
});
