import { test, expect } from '~/fixtures.ts';

/**
 * Builds a grid that records every row selection event payload on
 * `window.selectionEvents`.
 */
async function setupGrid(
    page: any,
    options: { cancel?: boolean } = {}
): Promise<void> {
    await page.goto('/grid-pro/basic/overview');

    await page.evaluate((setup: { cancel?: boolean }) => {
        const rows = Array.from({ length: 20 }, (_, i) => ({
            id: 'ROW-' + String(i + 1).padStart(3, '0'),
            product: 'Product ' + (i + 1)
        }));

        document.body.innerHTML =
            '<div id="container" style="height: 320px;"></div>';

        (window as any).selectionEvents = [];

        (window as any).grid = (window as any).Grid.grid('container', {
            data: {
                columns: {
                    id: rows.map((row) => row.id),
                    product: rows.map((row) => row.product)
                },
                idColumn: 'id'
            },
            columns: [{ id: 'id', enabled: false }],
            rowSelection: {
                enabled: true,
                mode: 'multiple',
                checkbox: { enabled: true }
            },
            events: {
                beforeRowSelectionChange: function (e: any): void {
                    (window as any).selectionEvents.push({
                        name: 'before',
                        added: e.addedRowIds,
                        removed: e.removedRowIds,
                        selected: e.selectedRowIds,
                        hasOriginalEvent: !!e.originalEvent
                    });

                    if (setup.cancel) {
                        e.preventDefault();
                    }
                },
                afterRowSelectionChange: function (e: any): void {
                    (window as any).selectionEvents.push({
                        name: 'after',
                        added: e.addedRowIds,
                        removed: e.removedRowIds,
                        selected: e.selectedRowIds,
                        hasOriginalEvent: !!e.originalEvent
                    });
                }
            }
        });
    }, options);

    await page.waitForFunction(
        () => typeof (window as any).grid?.rowSelection !== 'undefined'
    );
    await page.waitForFunction(
        () => document.querySelectorAll('tbody td').length > 0
    );
}

function events(page: any): Promise<Array<Record<string, any>>> {
    return page.evaluate(() => (window as any).selectionEvents);
}

function productCell(page: any, rowIndex: number) {
    return page.locator(
        `tbody tr[data-row-index="${rowIndex}"] td[data-column-id="product"]`
    );
}

test.describe('Grid Pro row selection events', () => {
    test('Fire once per gesture with the affected rows and the selection',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 1).click();

            expect(await events(page)).toEqual([
                {
                    name: 'before',
                    added: ['ROW-002'],
                    removed: [],
                    selected: [],
                    hasOriginalEvent: true
                },
                {
                    name: 'after',
                    added: ['ROW-002'],
                    removed: [],
                    selected: ['ROW-002'],
                    hasOriginalEvent: true
                }
            ]);
        });

    test('Report the deselected row when a selection is removed',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 1).click();
            await page.evaluate(
                () => ((window as any).selectionEvents = [])
            );
            await productCell(page, 1).click();

            const recorded = await events(page);
            expect(recorded).toHaveLength(2);
            expect(recorded[1]).toEqual({
                name: 'after',
                added: [],
                removed: ['ROW-002'],
                selected: [],
                hasOriginalEvent: true
            });
        });

    test('A Shift range fires a single event carrying the whole range',
        async ({ page }) => {
            await setupGrid(page);

            await productCell(page, 1).click();
            await page.evaluate(
                () => ((window as any).selectionEvents = [])
            );
            await productCell(page, 4).click({ modifiers: ['Shift'] });

            const recorded = await events(page);
            expect(recorded.filter((e) => e.name === 'after')).toHaveLength(1);
            expect(recorded[1].added).toEqual([
                'ROW-003', 'ROW-004', 'ROW-005'
            ]);
            expect(recorded[1].selected).toEqual([
                'ROW-002', 'ROW-003', 'ROW-004', 'ROW-005'
            ]);
        });

    test('API changes fire the events without an original event',
        async ({ page }) => {
            await setupGrid(page);

            await page.evaluate(() => {
                (window as any).grid.rowSelection.select('ROW-003');
            });

            const recorded = await events(page);
            expect(recorded).toHaveLength(2);
            expect(recorded[1]).toEqual({
                name: 'after',
                added: ['ROW-003'],
                removed: [],
                selected: ['ROW-003'],
                hasOriginalEvent: false
            });
        });

    test('preventDefault cancels the change and leaves nothing behind',
        async ({ page }) => {
            await setupGrid(page, { cancel: true });

            const checkbox = page.locator(
                'tbody tr[data-row-index="1"] .hcg-selection-checkbox'
            );
            await checkbox.click();

            const recorded = await events(page);
            expect(recorded.map((e) => e.name)).toEqual(['before']);

            expect(await page.evaluate(
                () => (window as any).grid.rowSelection.getSelectedRowIds()
            )).toEqual([]);

            // The browser flips a clicked checkbox before the handler runs, so
            // a cancelled change has to put it back.
            await expect(checkbox).not.toBeChecked();
            await expect(
                page.locator('tbody tr[data-row-index="1"]')
            ).not.toHaveClass(/hcg-row-selected/);
        });

    test('No event fires when a change is a no-op', async ({ page }) => {
        await setupGrid(page);

        await page.evaluate(() => {
            (window as any).grid.rowSelection.select('ROW-002');
            (window as any).selectionEvents = [];
            // Already selected, and deselecting a row that is not selected.
            (window as any).grid.rowSelection.select('ROW-002');
            (window as any).grid.rowSelection.deselect('ROW-010');
        });

        expect(await events(page)).toEqual([]);
    });
});
