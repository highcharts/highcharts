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
