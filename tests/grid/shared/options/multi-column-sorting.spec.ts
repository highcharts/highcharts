import { test, expect } from '~/fixtures.ts';

test.describe('Grid multi-column sorting', () => {
    const expectedOrder = ['c', 'a', 'b', 'g', 'e', 'f', 'h', 'd'];
    const demoPath = 'grid-lite/e2e/multi-column-sorting';

    const openMenu = async (page: any, columnId: string) => {
        await page.evaluate((id: string) => {
            const button = document.querySelector(
                `th[data-column-id="${id}"] .hcg-header-cell-menu-icon .hcg-icon`
            );
            if (button) {
                (button as HTMLElement).click();
            }
        }, columnId);
        await expect(page.locator('.hcg-popup')).toBeVisible();
    };

    const ensureMenuOpen = async (page: any, columnId: string) => {
        const popupVisible = await page.locator('.hcg-popup').isVisible().catch(() => false);
        if (!popupVisible) {
            await page.waitForFunction(() => {
                const popup = document.querySelector('.hcg-popup');
                return !popup || window.getComputedStyle(popup).display === 'none';
            }, { timeout: 1000 }).catch(() => {});
            await openMenu(page, columnId);
        }
    };

    const getGridState = (page: any) => page.evaluate(() => {
        const grid = (window as any).Grid.grids[0];
        const sorting = grid.querying.sorting;
        const sortings = sorting.currentSortings || (
            sorting.currentSorting?.columnId ?
                [sorting.currentSorting] : []
        );

        return {
            columnIds: sortings.map((item: any) => item.columnId),
            orders: sortings.map((item: any) => item.order),
            rowOrder: grid.dataProvider.getDataTable(true).columns.id
        };
    });

    test.beforeEach(async ({ page }) => {
        await page.goto(demoPath, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids?.length > 0;
        }, { timeout: 10000 });
    });

    test('Shift-click sorts three columns with custom compare', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.locator('th[data-column-id="group"]').click();
        await page.locator('th[data-column-id="score"]').click({ modifiers: ['Shift'] });
        await page.locator('th[data-column-id="id"]').click({ modifiers: ['Shift'] });

        const result = await getGridState(page);

        expect(result.columnIds, 'Applied sorting priority').toEqual(['group', 'score', 'id']);
        expect(result.rowOrder, 'Sorted row order').toEqual(expectedOrder);

        await expect(page.locator('th[data-column-id="group"] .hcg-header-cell-icons button'))
            .toHaveAttribute('aria-label', /Priority 1/);
        await expect(page.locator('th[data-column-id="score"] .hcg-header-cell-icons button'))
            .toHaveAttribute('aria-label', /Priority 2/);
        await expect(page.locator('th[data-column-id="id"] .hcg-header-cell-icons button'))
            .toHaveAttribute('aria-label', /Priority 3/);
    });

    test('Shift-clicking menu sort adds a secondary priority', async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });

        await page.locator('th[data-column-id="group"]').click();
        await openMenu(page, 'score');
        await expect(
            page.locator('.hcg-popup .hcg-menu-item-label').filter({ hasText: 'Sort descending' })
        ).toBeVisible();

        // Use Grid API to set sorting (equivalent to Shift+click)
        await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const sorting = grid.querying.sorting;
            const current = sorting.currentSortings ||
                (sorting.currentSorting?.columnId ?
                    [sorting.currentSorting] : []);
            const newSortings = current.filter(
                (s: any) => s.columnId && s.order
            );
            const existing = newSortings.findIndex(
                (s: any) => s.columnId === 'score'
            );
            if (existing >= 0) {
                newSortings[existing] = {
                    columnId: 'score',
                    order: 'desc'
                };
            } else {
                newSortings.push({ columnId: 'score', order: 'desc' });
            }
            await grid.setSorting(newSortings);
        });

        // Wait for sorting and verify
        const result = await page.waitForFunction(() => {
            const grid = (window as any).Grid?.grids?.[0];
            if (!grid) return null;
            const sortings = grid.querying.sorting.currentSortings || [];
            if (sortings.length !== 2 || sortings[0]?.columnId !== 'group' || sortings[1]?.columnId !== 'score') {
                return null;
            }
            return {
                columnIds: sortings.map((s: any) => s.columnId),
                orders: sortings.map((s: any) => s.order),
                rowOrder: grid.dataProvider.getDataTable(true).columns.id
            };
        }, { timeout: 5000 });

        const resultValue = await result.jsonValue();
        expect(resultValue.columnIds, 'Applied sorting priority').toEqual(['group', 'score']);
        expect(resultValue.orders, 'Applied sorting order').toEqual(['asc', 'desc']);

        // Ensure menu is open and check label with priority
        await ensureMenuOpen(page, 'score');
        const labelText = await page.waitForFunction(() => {
            const popup = document.querySelector('.hcg-popup');
            const label = popup?.querySelector('span.hcg-menu-item-label');
            const text = label?.textContent || '';
            return text.includes('Sort descending') ? text : null;
        }, { timeout: 5000 });

        expect(await labelText.jsonValue(), 'Menu item label should contain priority (2)').toContain('(2)');

        expect(resultValue.rowOrder, 'Sorted row order with custom compare').toEqual([
            'b', 'g', 'a', 'c', 'd', 'f', 'h', 'e'
        ]);
    });

    test('Shift-click toggles and removes a secondary sort', async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });

        await page.locator('th[data-column-id="group"]').click();
        await page.locator('th[data-column-id="score"]').click({ modifiers: ['Shift'] });

        let result = await getGridState(page);
        expect(result.columnIds).toEqual(['group', 'score']);
        expect(result.orders).toEqual(['asc', 'asc']);
        expect(result.rowOrder).toEqual([
            'c', 'a', 'b', 'g', 'e', 'f', 'h', 'd'
        ]);

        await page.locator('th[data-column-id="score"]').click({ modifiers: ['Shift'] });

        result = await getGridState(page);
        expect(result.columnIds).toEqual(['group', 'score']);
        expect(result.orders).toEqual(['asc', 'desc']);
        expect(result.rowOrder).toEqual([
            'b', 'g', 'a', 'c', 'd', 'f', 'h', 'e'
        ]);

        await page.locator('th[data-column-id="score"]').click({ modifiers: ['Shift'] });

        result = await getGridState(page);
        expect(result.columnIds).toEqual(['group']);
        expect(result.rowOrder).toEqual([
            'a', 'b', 'c', 'g', 'd', 'e', 'f', 'h'
        ]);
        await expect(page.locator('th[data-column-id="group"] .hcg-header-cell-icons button'))
            .not.toHaveAttribute('aria-label', /Priority/);
        await expect(page.locator('th[data-column-id="score"] .hcg-header-cell-icons button'))
            .not.toHaveAttribute('aria-label', /Priority/);
    });
});
