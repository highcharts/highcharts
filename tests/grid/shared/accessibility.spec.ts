import { test, expect } from '~/fixtures.ts';

test.describe('Grid accessibility semantics', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('grid-lite/e2e/filtering', { waitUntil: 'networkidle' });
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                (window as any).Grid.grids &&
                (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Tab enters the first leaf header instead of the first data cell', async ({ page }) => {
        await page.evaluate(() => {
            const before = document.createElement('button');
            before.id = 'before-grid';
            before.textContent = 'Before grid';
            document.body.prepend(before);
        });

        await page.locator('#before-grid').focus();
        await page.keyboard.press('Tab');

        const focused = page.locator(':focus');
        await expect(focused).toHaveAttribute('role', 'columnheader');
        await expect(focused).toHaveAttribute('data-column-id', 'id');
    });

    test('Leaf header naming follows the rendered header text instead of internal ids', async ({ page }) => {
        const productHeader = page.locator('thead th[data-column-id="product"][id]');

        const expectedLabel = await productHeader.locator(
            '.hcg-header-cell-content'
        ).textContent();

        await expect(productHeader).toHaveAttribute(
            'aria-label',
            expectedLabel?.trim() || ''
        );
    });

    test('Grid exposes row and column header associations for body cells', async ({ page }) => {
        const snapshot = await page.evaluate(() => {
            const table = document.querySelector('table');
            const row = document.querySelector('tbody tr');
            const rowHeader = row?.querySelector(
                'td[data-column-id="id"]'
            );
            const secondDataCell = row?.querySelector(
                'td[data-column-id="active"]'
            );
            const idHeader = document.querySelector(
                'thead th[data-column-id="id"]'
            );
            const activeHeader = document.querySelector(
                'thead th[data-column-id="active"]'
            );

            return {
                ariaColCount: table?.getAttribute('aria-colcount') || null,
                rowHeaderTag: rowHeader?.tagName || null,
                rowHeaderRole: rowHeader?.getAttribute('role') || null,
                rowHeaderId: rowHeader?.id || null,
                rowHeaderHeaders: rowHeader?.getAttribute('headers') || null,
                rowHeaderColIndex: rowHeader?.getAttribute('aria-colindex') || null,
                secondDataCellHeaders: secondDataCell?.getAttribute('headers') || null,
                secondDataCellColIndex: secondDataCell?.getAttribute('aria-colindex') || null,
                idHeaderId: idHeader?.id || null,
                activeHeaderId: activeHeader?.id || null
            };
        });

        expect(snapshot.ariaColCount).toBeTruthy();
        expect(snapshot.rowHeaderTag).toBe('TD');
        expect(snapshot.rowHeaderRole).toBe('rowheader');
        expect(snapshot.rowHeaderColIndex).toBe('1');
        expect(snapshot.rowHeaderHeaders).toContain(snapshot.idHeaderId);
        expect(snapshot.rowHeaderId).toBeTruthy();
        expect(snapshot.secondDataCellColIndex).toBe('2');
        expect(snapshot.secondDataCellHeaders)
            .toContain(snapshot.rowHeaderId);
        expect(snapshot.secondDataCellHeaders)
            .toContain(snapshot.activeHeaderId);
    });

    test('Hiding the first visible column reassigns the row header source', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.update({
                columns: [{
                    id: 'id',
                    enabled: false
                }]
            });
        });

        await page.waitForFunction(() => (
            !document.querySelector('thead th[data-column-id="id"]')
        ));

        const snapshot = await page.evaluate(() => {
            const row = document.querySelector('tbody tr');
            const rowHeader = row?.querySelector(
                'td[data-column-id="active"]'
            );
            const firstDataCell = row?.querySelector(
                'td[data-column-id="date"]'
            );
            const nextHeader = document.querySelector(
                'thead th[data-column-id="active"]'
            );
            const dateHeader = document.querySelector(
                'thead th[data-column-id="date"]'
            );

            return {
                rowHeaderColumnId:
                    rowHeader?.getAttribute('data-column-id') || null,
                rowHeaderRole:
                    rowHeader?.getAttribute('role') || null,
                rowHeaderId:
                    rowHeader?.id || null,
                rowHeaderColIndex:
                    rowHeader?.getAttribute('aria-colindex') || null,
                rowHeaderHeaders:
                    rowHeader?.getAttribute('headers') || null,
                firstDataCellColumnId:
                    firstDataCell?.getAttribute('data-column-id') || null,
                firstDataCellColIndex:
                    firstDataCell?.getAttribute('aria-colindex') || null,
                firstDataCellHeaders:
                    firstDataCell?.getAttribute('headers') || null,
                nextHeaderId: nextHeader?.id || null,
                dateHeaderId: dateHeader?.id || null
            };
        });

        expect(snapshot.rowHeaderColumnId).toBe('active');
        expect(snapshot.rowHeaderRole).toBe('rowheader');
        expect(snapshot.rowHeaderColIndex).toBe('1');
        expect(snapshot.rowHeaderHeaders).toContain(snapshot.nextHeaderId);
        expect(snapshot.rowHeaderId).toBeTruthy();
        expect(snapshot.firstDataCellColumnId).toBe('date');
        expect(snapshot.firstDataCellColIndex).toBe('2');
        expect(snapshot.firstDataCellHeaders)
            .toContain(snapshot.rowHeaderId);
        expect(snapshot.firstDataCellHeaders)
            .toContain(snapshot.dateHeaderId);
    });
});
