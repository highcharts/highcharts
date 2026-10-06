import { test, expect } from '~/fixtures.ts';
import type { Page } from '@playwright/test';

const PAGE = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
        </head>
        <body>
            <div id="container" style="width: 500px; height: 300px"></div>
        </body>
    </html>
`;

const EMPTY_STATE_BUTTON = '#container .hcg-empty-state-button';

/**
 * Renders a grid with table editing on, and editable cells so that the rows
 * the UI creates can actually be filled in.
 */
async function renderGrid(page: Page, options: unknown): Promise<void> {
    await page.setContent(PAGE, { waitUntil: 'networkidle' });
    await page.evaluate(async (gridOptions) => {
        await (window as any).Grid.grid(
            document.getElementById('container'),
            {
                columnDefaults: { cells: { editMode: { enabled: true } } },
                tableEditing: { enabled: true },
                ...(gridOptions as Record<string, unknown>)
            },
            true
        );
    }, options);
}

/** Returns a description of the focused element. */
function focused(page: Page): Promise<string> {
    return page.evaluate(() => {
        const element = document.activeElement as HTMLElement;

        if (!element || element === document.body) {
            return 'body';
        }

        return element.tagName.toLowerCase() +
            '[' + (element.getAttribute('data-column-id') ?? element.className) +
            '@' + (element.closest('tr')?.getAttribute('data-row-index') ?? '-') +
            ']';
    });
}

/** Picks an action out of the cell context menu of the given cell. */
async function runMenuAction(
    page: Page,
    cellSelector: string,
    group: string,
    action: string
): Promise<void> {
    await page.locator(cellSelector).click({ button: 'right' });
    await page.locator('.hcg-menu-item', { hasText: group }).first().click();
    await page.locator('.hcg-menu-item', { hasText: action }).first().click();
    await page.waitForFunction(() => !document.querySelector('.hcg-popup'));
}

test.describe('Table editing empty state', () => {
    test('A table without columns offers the first column, then the first row', async ({ page }) => {
        await renderGrid(page, { data: { columns: {} } });

        const button = page.locator(EMPTY_STATE_BUTTON);
        await expect(button).toHaveText('Add column');

        await button.click();
        await expect(page.locator('#container thead th')).toHaveCount(1);
        await expect(button).toHaveText('Add row');

        await button.click();
        await expect(page.locator('#container tbody tr td')).toHaveCount(1);
        await expect(button).toHaveCount(0);
    });

    test('A table without rows offers the first row and focuses it', async ({ page }) => {
        await renderGrid(page, {
            data: { columns: { product: [], stock: [] } }
        });

        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveText('Add row');
        await page.locator(EMPTY_STATE_BUTTON).click();

        await expect(page.locator('#container tbody tr')).toHaveCount(1);
        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveCount(0);
        expect(await focused(page)).toBe('td[product@0]');
    });

    test('A table with data offers nothing', async ({ page }) => {
        await renderGrid(page, {
            data: { columns: { product: ['Apples'], stock: [100] } }
        });

        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveCount(0);
    });

    test('Disabled table editing offers nothing on an empty table', async ({ page }) => {
        await renderGrid(page, {
            data: { columns: {} },
            tableEditing: { enabled: false }
        });

        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveCount(0);
    });

    test('A filter hiding every row is not an empty table', async ({ page }) => {
        await renderGrid(page, {
            data: { columns: { product: ['Apples'], stock: [100] } },
            columns: [{
                id: 'product',
                filtering: { enabled: true, condition: 'contains', value: 'zz' }
            }]
        });

        await expect(page.locator('#container tbody tr')).toHaveCount(0);
        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveCount(0);
    });

    test('Deleting the last row brings the button back and focuses it', async ({ page }) => {
        await renderGrid(page, {
            data: { columns: { product: ['Apples'], stock: [100] } }
        });

        await runMenuAction(
            page,
            '#container tbody td[data-column-id="product"]',
            'Rows',
            'Delete row'
        );

        await expect(page.locator(EMPTY_STATE_BUTTON)).toHaveText('Add row');
        expect(await focused(page)).toContain('empty-state-button');
    });
});

test.describe('Table editing focus', () => {
    const THREE_ROWS = {
        data: {
            columns: {
                product: ['Apples', 'Pears', 'Plums'],
                stock: [100, 40, 25]
            }
        }
    };
    const SECOND_ROW = '#container tbody tr[data-row-index="1"] ' +
        'td[data-column-id="product"]';

    test('Adding a row below focuses the new row', async ({ page }) => {
        await renderGrid(page, THREE_ROWS);
        await runMenuAction(page, SECOND_ROW, 'Rows', 'Add row below');

        await expect(page.locator('#container tbody tr')).toHaveCount(4);
        expect(await focused(page)).toBe('td[product@2]');
    });

    test('Adding a row above focuses the new row', async ({ page }) => {
        await renderGrid(page, THREE_ROWS);
        await runMenuAction(page, SECOND_ROW, 'Rows', 'Add row above');

        expect(await focused(page)).toBe('td[product@1]');

        // The row that was clicked moved down to make room.
        await expect(
            page.locator('#container tbody tr[data-row-index="2"] td').first()
        ).toHaveAttribute('data-value', 'Pears');
    });

    test('Deleting a row focuses the row that took its place', async ({ page }) => {
        await renderGrid(page, THREE_ROWS);
        await runMenuAction(page, SECOND_ROW, 'Rows', 'Delete row');

        expect(await focused(page)).toBe('td[product@1]');
        await expect(
            page.locator('#container tbody tr[data-row-index="1"] td').first()
        ).toHaveAttribute('data-value', 'Plums');
    });

    test('Adding a column focuses the new column on the same row', async ({ page }) => {
        await renderGrid(page, THREE_ROWS);
        await runMenuAction(page, SECOND_ROW, 'Columns', 'Add column after');

        await expect(page.locator('#container thead th')).toHaveCount(3);
        expect(await focused(page)).toBe('td[column3@1]');
    });

    test('Deleting a column focuses the column that took its place', async ({ page }) => {
        await renderGrid(page, THREE_ROWS);
        await runMenuAction(page, SECOND_ROW, 'Columns', 'Delete column');

        expect(await focused(page)).toBe('td[stock@1]');
    });

    test('Sorting decides where the added row goes, and the focus follows', async ({ page }) => {
        await renderGrid(page, {
            ...THREE_ROWS,
            columns: [{ id: 'product', sorting: { order: 'desc' } }]
        });

        // Sorted desc the rows read Plums, Pears, Apples. The row added below
        // Pears is empty, so it sorts to the end rather than to index 2.
        await runMenuAction(page, SECOND_ROW, 'Rows', 'Add row below');

        await expect(page.locator('#container tbody tr')).toHaveCount(4);
        expect(await focused(page)).toBe('td[product@3]');
    });

    test('A filter hiding the added row leaves the focus alone', async ({ page }) => {
        await renderGrid(page, {
            ...THREE_ROWS,
            columns: [{
                id: 'product',
                filtering: { enabled: true, condition: 'contains', value: 's' }
            }]
        });

        await runMenuAction(page, SECOND_ROW, 'Rows', 'Add row below');

        // The row is in the data, but the filter keeps it off screen, so
        // there is no cell to move to.
        await expect(page.locator('#container tbody tr')).toHaveCount(3);
        expect(await focused(page)).toBe('body');
    });
});

test.describe('Table editing column rename', () => {
    const ONE_COLUMN = { data: { columns: { product: ['Apples'] } } };
    const HEADER = '#container thead th[data-column-id="product"]';
    const LABEL = HEADER + ' .hcg-header-cell-content';
    const RENAME_INPUT = HEADER + ' input';
    const RENAME_ITEM = '.hcg-menu-item:has-text("Rename column")';

    /** Returns the data keys, which renaming must leave alone. */
    function dataKeys(page: Page): Promise<string[]> {
        return page.evaluate(() => (window as any).Grid.grids[0]
            .dataProvider.getDataTable().getColumnIds());
    }

    /** Opens the header context menu and picks the rename action. */
    async function startRename(page: Page, header = HEADER): Promise<void> {
        await page.locator(header).click({ button: 'right' });
        await page.locator(RENAME_ITEM).click();
    }

    test('The header context menu renames the column label', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);

        await startRename(page);
        await expect(page.locator(RENAME_INPUT)).toHaveValue('product');

        // The input replaces the label in place, so it must not widen the
        // header or spill out of it.
        const header = await page.locator(HEADER).boundingBox();
        const input = await page.locator(RENAME_INPUT).boundingBox();
        expect(input.x).toBeGreaterThanOrEqual(header.x);
        expect(input.x + input.width).toBeLessThanOrEqual(
            header.x + header.width
        );

        await page.locator(RENAME_INPUT).fill('Produce');
        await page.keyboard.press('Enter');

        await expect(page.locator(LABEL)).toHaveText('Produce');
        expect(await dataKeys(page)).toEqual(['product']);
    });

    test('Entering edit mode keeps the header height', async ({ page }) => {
        // A table seeded from empty has no row pinning the header height, so
        // anything taken out of the header flow makes the row jump.
        await renderGrid(page, { data: { columns: {} } });
        await page.locator(EMPTY_STATE_BUTTON).click();
        await page.locator(EMPTY_STATE_BUTTON).click();
        await page.waitForSelector('#container tbody td');

        const anyHeader = '#container thead th';
        const height = (): Promise<number | undefined> => page
            .locator(anyHeader).first().boundingBox()
            .then((box): number | undefined => box?.height);
        const before = await height();

        await page.locator(anyHeader).first().click({ button: 'right' });
        await page.locator(RENAME_ITEM).click();
        expect(await height()).toBe(before);

        await page.keyboard.press('Escape');
        expect(await height()).toBe(before);
    });

    test('Opening the menu leaves the sorting alone', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);
        await page.locator(HEADER).click({ button: 'right' });

        expect(await page.evaluate(() => (window as any).Grid.grids[0]
            .querying.sorting.currentSortings)).toBeFalsy();
    });

    test('F2 opens the rename and Escape discards it', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);

        await page.locator(HEADER).focus();
        await page.keyboard.press('F2');
        await page.locator(RENAME_INPUT).fill('Produce');
        await page.keyboard.press('Escape');

        await expect(page.locator(RENAME_INPUT)).toHaveCount(0);
        await expect(page.locator(LABEL)).toHaveText('product');
    });

    test('An empty name is discarded', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);

        await startRename(page);
        await page.locator(RENAME_INPUT).fill('   ');
        await page.keyboard.press('Enter');

        await expect(page.locator(LABEL)).toHaveText('product');
    });

    test('The renamed label survives a redraw', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);

        await startRename(page);
        await page.locator(RENAME_INPUT).fill('Produce');
        await page.keyboard.press('Enter');

        await page.evaluate(
            () => (window as any).Grid.grids[0].update({}, true)
        );
        await expect(page.locator(LABEL)).toHaveText('Produce');
    });

    test('Disabled table editing offers no header menu', async ({ page }) => {
        await renderGrid(page, {
            ...ONE_COLUMN,
            tableEditing: { enabled: false }
        });

        await page.locator(HEADER).click({ button: 'right' });
        await expect(page.locator(RENAME_ITEM)).toHaveCount(0);
    });

    test('Disabled column renaming offers no rename', async ({ page }) => {
        await renderGrid(page, {
            ...ONE_COLUMN,
            tableEditing: { enabled: true, columnRenaming: { enabled: false } }
        });

        await page.locator(HEADER).click({ button: 'right' });
        await expect(page.locator(RENAME_ITEM)).toHaveCount(0);
    });

    test('Changing the id is not offered unless asked for', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);
        await page.locator(HEADER).click({ button: 'right' });

        await expect(page.locator(RENAME_ITEM)).toHaveCount(1);
        await expect(page.locator(
            '.hcg-menu-item:has-text("Change column id")'
        )).toHaveCount(0);
    });

    test('A header formatter blocks the rename, since it would win', async ({ page }) => {
        await renderGrid(page, ONE_COLUMN);
        await page.evaluate(() => (window as any).Grid.grids[0].update({
            columns: [{
                id: 'product',
                header: { formatter: () => 'Fixed' }
            }]
        }, true));

        await page.locator(HEADER).click({ button: 'right' });
        await expect(page.locator(RENAME_ITEM)).toHaveCount(0);
        await expect(page.locator(LABEL)).toHaveText('Fixed');
    });
});

test.describe('Table editing column id change', () => {
    const TWO_COLUMNS = {
        data: { columns: { product: ['Apples'], stock: [100] } },
        tableEditing: {
            enabled: true,
            columnIdEditing: { enabled: true }
        }
    };
    const HEADER = '#container thead th[data-column-id="product"]';
    const RENAME_INPUT = '#container thead th input';
    const ID_ITEM = '.hcg-menu-item:has-text("Change column id")';

    /** Returns the data keys, which an id change must move. */
    function dataKeys(page: Page): Promise<string[]> {
        return page.evaluate(() => (window as any).Grid.grids[0]
            .dataProvider.getDataTable().getColumnIds());
    }

    /** Opens the header context menu and picks the id action. */
    async function renameTo(page: Page, name: string): Promise<void> {
        await page.locator(HEADER).click({ button: 'right' });
        await page.locator(ID_ITEM).click();
        await page.locator(RENAME_INPUT).fill(name);
        await page.keyboard.press('Enter');
    }

    test('Changing the id moves the data key and keeps the column order', async ({ page }) => {
        await renderGrid(page, TWO_COLUMNS);
        await renameTo(page, 'produce');

        expect(await dataKeys(page)).toEqual(['produce', 'stock']);
        await expect(
            page.locator('#container thead th[data-column-id="produce"]')
        ).toHaveCount(1);
        await expect(
            page.locator('#container tbody td').first()
        ).toHaveAttribute('data-value', 'Apples');
    });

    test('Column options follow the new id', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            columns: [{ id: 'product', width: 220 }]
        });
        await renameTo(page, 'produce');

        expect(await page.evaluate(() => (window as any).Grid.grids[0]
            .viewport.getColumn('produce').options.width)).toBe(220);
    });

    test('A taken id is refused and keeps the input open', async ({ page }) => {
        await renderGrid(page, TWO_COLUMNS);

        await page.locator(HEADER).click({ button: 'right' });
        await page.locator(ID_ITEM).click();
        await page.locator(RENAME_INPUT).fill('stock');
        await page.keyboard.press('Enter');

        await expect(page.locator(RENAME_INPUT)).toHaveAttribute(
            'aria-invalid', 'true'
        );
        expect(await dataKeys(page)).toEqual(['product', 'stock']);
    });

    test('The grouped header follows the new id', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            header: [{ format: 'Group', columns: ['product', 'stock'] }]
        });
        await renameTo(page, 'produce');

        await expect(
            page.locator('#container thead th[data-column-id="produce"]')
        ).toHaveCount(1);
    });

    test('The displayed name is left alone, since renaming is its own action', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            columns: [{ id: 'product', header: { format: 'Produce' } }]
        });
        await renameTo(page, 'fruit');

        expect(await dataKeys(page)).toEqual(['fruit', 'stock']);
        await expect(page.locator(
            '#container thead th[data-column-id="fruit"]' +
            ' .hcg-header-cell-content'
        )).toHaveText('Produce');
    });

    test('Sorting keeps applying after the rename', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            data: { columns: { product: ['Pears', 'Apples'], stock: [40, 100] } },
            columns: [{ id: 'product', sorting: { order: 'asc' } }]
        });
        await renameTo(page, 'produce');

        await expect(
            page.locator('#container tbody td').first()
        ).toHaveAttribute('data-value', 'Apples');
    });

    test('Sorting applied by clicking the header also survives', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            data: { columns: { product: ['Pears', 'Apples'], stock: [40, 100] } }
        });
        await page.locator(HEADER).click();
        await expect(
            page.locator('#container tbody td').first()
        ).toHaveAttribute('data-value', 'Apples');

        await renameTo(page, 'produce');

        await expect(
            page.locator('#container tbody td').first()
        ).toHaveAttribute('data-value', 'Apples');
    });

    test('A column read through dataId is refused', async ({ page }) => {
        await renderGrid(page, {
            ...TWO_COLUMNS,
            columns: [{ id: 'label', dataId: 'product' }]
        });

        await page.locator(
            '#container thead th[data-column-id="label"]'
        ).click({ button: 'right' });

        await expect(page.locator(ID_ITEM)).toBeDisabled();
    });

    test('A header formatter blocks renaming but not the id', async ({ page }) => {
        await renderGrid(page, TWO_COLUMNS);
        await page.evaluate(() => (window as any).Grid.grids[0].update({
            columns: [{
                id: 'product',
                header: { formatter: () => 'Fixed' }
            }]
        }, true));

        await page.locator(HEADER).click({ button: 'right' });
        await expect(page.locator(
            '.hcg-menu-item:has-text("Rename column")'
        )).toHaveCount(0);
        await expect(page.locator(ID_ITEM)).toBeEnabled();
    });
});
