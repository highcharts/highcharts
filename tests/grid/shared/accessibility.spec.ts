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
        await expect(focused).toHaveAttribute('scope', 'col');
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

    test('Grid exposes column header associations and focus labels for body cells', async ({ page }) => {
        const snapshot = await page.evaluate(() => {
            const row = document.querySelector('tbody tr');
            const firstCell = row?.querySelector(
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
                firstCellTag: firstCell?.tagName || null,
                firstCellId: firstCell?.id || null,
                firstCellHeaders: firstCell?.getAttribute('headers') || null,
                firstCellLabelledBy:
                    firstCell?.getAttribute('aria-labelledby') || null,
                idHeaderId: idHeader?.id || null,
                secondDataCellHeaders: secondDataCell?.getAttribute('headers') || null,
                secondDataCellId: secondDataCell?.id || null,
                secondDataCellLabelledBy:
                    secondDataCell?.getAttribute('aria-labelledby') || null,
                activeHeaderId: activeHeader?.id || null
            };
        });

        expect(snapshot.firstCellTag).toBe('TD');
        expect(snapshot.firstCellId).toBeTruthy();
        expect(snapshot.firstCellHeaders).toContain(snapshot.idHeaderId);
        expect(snapshot.firstCellLabelledBy)
            .toBe(`${snapshot.idHeaderId} ${snapshot.firstCellId}`);
        expect(snapshot.secondDataCellHeaders)
            .toContain(snapshot.activeHeaderId);
        expect(snapshot.secondDataCellLabelledBy)
            .toBe(`${snapshot.activeHeaderId} ${snapshot.secondDataCellId}`);
    });

    test('Hiding the first visible column keeps body cells uniform', async ({ page }) => {
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
            const firstCell = row?.querySelector(
                'td[data-column-id="active"]'
            );
            const firstDataCell = row?.querySelector(
                'td[data-column-id="date"]'
            );
            const activeHeader = document.querySelector(
                'thead th[data-column-id="active"]'
            );
            const dateHeader = document.querySelector(
                'thead th[data-column-id="date"]'
            );

            return {
                firstCellColumnId:
                    firstCell?.getAttribute('data-column-id') || null,
                firstCellTag:
                    firstCell?.tagName || null,
                firstCellId:
                    firstCell?.id || null,
                firstCellHeaders:
                    firstCell?.getAttribute('headers') || null,
                firstCellLabelledBy:
                    firstCell?.getAttribute('aria-labelledby') || null,
                firstDataCellColumnId:
                    firstDataCell?.getAttribute('data-column-id') || null,
                firstDataCellId:
                    firstDataCell?.id || null,
                firstDataCellHeaders:
                    firstDataCell?.getAttribute('headers') || null,
                firstDataCellLabelledBy:
                    firstDataCell?.getAttribute('aria-labelledby') || null,
                activeHeaderId: activeHeader?.id || null,
                dateHeaderId: dateHeader?.id || null
            };
        });

        expect(snapshot.firstCellColumnId).toBe('active');
        expect(snapshot.firstCellTag).toBe('TD');
        expect(snapshot.firstCellHeaders).toContain(snapshot.activeHeaderId);
        expect(snapshot.firstCellLabelledBy)
            .toBe(`${snapshot.activeHeaderId} ${snapshot.firstCellId}`);
        expect(snapshot.firstDataCellColumnId).toBe('date');
        expect(snapshot.firstDataCellHeaders)
            .toContain(snapshot.dateHeaderId);
        expect(snapshot.firstDataCellLabelledBy)
            .toBe(`${snapshot.dateHeaderId} ${snapshot.firstDataCellId}`);
    });
});
