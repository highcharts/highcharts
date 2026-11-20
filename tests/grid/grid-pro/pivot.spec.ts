import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

const SOURCE_COLUMNS = {
    region: ['Europe', 'Europe', 'Europe', 'Asia'],
    country: ['Norway', 'Norway', 'Poland', 'Japan'],
    year: [2025, 2026, 2025, 2025],
    sales: [100, 140, 80, 200],
    units: [3, 4, 2, 5]
};

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

async function createGrid(page: Page, options: unknown): Promise<void> {
    await page.evaluate(async (gridOptions): Promise<void> => {
        (window as any).grid = await (window as any).Grid.grid(
            'container',
            gridOptions,
            true
        );
    }, options);
}

async function getRowLabels(page: Page): Promise<string[]> {
    return page
        .locator(
            'tbody:not(.hcg-tbody-summary) .hcg-row ' +
            'td[data-column-id="pivotRows"] .hcg-disclosure-value'
        )
        .evaluateAll((elements): string[] =>
            elements.map((element): string => element.textContent?.trim() || '')
        );
}

async function getColumnValues(
    page: Page,
    columnId: string
): Promise<string[]> {
    return page
        .locator(
            'tbody:not(.hcg-tbody-summary) .hcg-row ' +
            `td[data-column-id="${columnId}"]`
        )
        .evaluateAll((cells): string[] =>
            cells.map((cell): string => cell.textContent?.trim() || '')
        );
}

async function getSummaryValues(
    page: Page,
    columnIds: string[]
): Promise<string[]> {
    return page.evaluate((ids): string[] => ids.map((id): string => (
        document.querySelector(
            `.hcg-tbody-summary td[data-column-id="${id}"]`
        )?.textContent?.trim() || ''
    )), columnIds);
}

async function getHeaderRows(page: Page): Promise<string[][]> {
    return page.locator('thead tr').evaluateAll((rows): string[][] =>
        rows.map((row): string[] =>
            Array.from(row.querySelectorAll('th')).map(
                (cell): string => cell.textContent?.trim() || ''
            )
        )
    );
}

const BASE_PIVOT_OPTIONS = {
    data: { columns: SOURCE_COLUMNS },
    pivot: {
        enabled: true,
        rows: ['region', 'country'],
        columns: ['year'],
        values: [
            { columnId: 'sales', aggregator: 'SUM' },
            { columnId: 'units', aggregator: 'AVERAGE' }
        ]
    },
    rendering: {
        rows: {
            expandedLevels: 'all',
            virtualization: false
        }
    }
};

test.describe('Grid Pro - pivot', () => {
    test('projects row and column fields into a pivot table', async ({
        page
    }) => {
        await loadGridPro(page);
        await createGrid(page, BASE_PIVOT_OPTIONS);

        // Field values are listed ascending, so Asia comes before Europe.
        expect(await getRowLabels(page)).toStrictEqual([
            'Asia',
            'Japan',
            'Europe',
            'Norway',
            'Poland'
        ]);

        expect(await getHeaderRows(page)).toStrictEqual([
            ['Rows', '2025', '2026', 'Total'],
            ['sales', 'units', 'sales', 'units', 'sales', 'units']
        ]);

        expect(await getColumnValues(page, 'pivot-0-sales')).toStrictEqual([
            '200', '200', '180', '100', '80'
        ]);
        // Asia and Poland have no 2026 source row, so their cells stay empty
        // instead of aggregating to zero.
        expect(await getColumnValues(page, 'pivot-1-sales')).toStrictEqual([
            '', '', '140', '140', ''
        ]);
        expect(await getColumnValues(page, 'pivot-total-sales'))
            .toStrictEqual(['200', '200', '320', '240', '80']);
    });

    test('aggregates subtotals and the grand total from source rows', async ({
        page
    }) => {
        await loadGridPro(page);
        await createGrid(page, BASE_PIVOT_OPTIONS);

        // Europe averages its 3 source rows (3, 4, 2), not the averages of
        // Norway (3.5) and Poland (2).
        expect(await getColumnValues(page, 'pivot-total-units'))
            .toStrictEqual(['5', '5', '3', '3.5', '2']);

        // The grand total averages all 4 source rows (3, 4, 2, 5).
        expect(
            await getSummaryValues(page, ['pivotRows', 'pivot-total-units'])
        ).toStrictEqual(['Total', '3.5']);
    });

    test('inherits header and cell formatting from the source columns',
        async ({ page }) => {
            await loadGridPro(page);
            await createGrid(page, {
                ...BASE_PIVOT_OPTIONS,
                columns: [{
                    id: 'sales',
                    header: { format: 'Sales' },
                    cells: { format: '${value:,0f}' }
                }, {
                    id: 'pivotRows',
                    header: { format: 'Region' }
                }]
            });

            expect((await getHeaderRows(page))[0][0]).toBe('Region');
            expect((await getHeaderRows(page))[1][0]).toBe('Sales');
            expect(await getColumnValues(page, 'pivot-0-sales'))
                .toStrictEqual(['$200', '$200', '$180', '$100', '$80']);
        });

    test('renders the flat source data when disabled', async ({ page }) => {
        await loadGridPro(page);
        await createGrid(page, {
            ...BASE_PIVOT_OPTIONS,
            pivot: { ...BASE_PIVOT_OPTIONS.pivot, enabled: false }
        });

        expect((await getHeaderRows(page))[0]).toStrictEqual([
            'region', 'country', 'year', 'sales', 'units'
        ]);
        await expect(page.locator('tbody .hcg-row')).toHaveCount(4);
    });

    test('restores the flat source data after disabling an applied pivot',
        async ({ page }) => {
            await loadGridPro(page);
            await createGrid(page, BASE_PIVOT_OPTIONS);

            await page.evaluate(async (): Promise<void> => {
                await (window as any).grid.update({
                    pivot: { enabled: false }
                });
            });

            expect((await getHeaderRows(page))[0]).toStrictEqual([
                'region', 'country', 'year', 'sales', 'units'
            ]);
            await expect(page.locator('tbody .hcg-row')).toHaveCount(4);
        });

    test('sorts sibling rows by an aggregated column', async ({ page }) => {
        await loadGridPro(page);
        await createGrid(page, {
            ...BASE_PIVOT_OPTIONS,
            columns: [{
                id: 'pivot-total-sales',
                sorting: { order: 'desc' }
            }]
        });

        // Europe (320) outranks Asia (200), Norway (240) outranks Poland (80).
        expect(await getRowLabels(page)).toStrictEqual([
            'Europe',
            'Norway',
            'Poland',
            'Asia',
            'Japan'
        ]);
    });

    test('pivots the rows left by filtering', async ({ page }) => {
        await loadGridPro(page);
        await createGrid(page, {
            ...BASE_PIVOT_OPTIONS,
            columns: [{
                id: 'country',
                filtering: {
                    enabled: true,
                    rule: { operator: 'doesNotEqual', value: 'Poland' }
                }
            }]
        });

        expect(await getRowLabels(page)).toStrictEqual([
            'Asia',
            'Japan',
            'Europe',
            'Norway'
        ]);

        // Europe without Poland's 80 sales in 2025.
        expect(await getColumnValues(page, 'pivot-0-sales')).toStrictEqual([
            '200', '200', '100', '100'
        ]);
    });

    test('exports the pivoted view', async ({ page }) => {
        await loadGridPro(page);
        await createGrid(page, BASE_PIVOT_OPTIONS);

        const csv = await page.evaluate((): string =>
            (window as any).grid.exporting.getCSV()
        );

        expect(csv.split('\n')[0]).toContain('"pivotRows"');
        expect(csv).toContain('"pivot-total-sales"');
        expect(csv).not.toContain('"region"');
    });

    test('is ignored when combined with row grouping', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (message): void => {
            if (message.type() === 'error') {
                errors.push(message.text());
            }
        });

        await loadGridPro(page);
        await createGrid(page, {
            ...BASE_PIVOT_OPTIONS,
            rowGrouping: { enabled: true, groupBy: 'region' }
        });

        expect(errors.join('\n')).toContain('Pivot:');
        expect(await getColumnValues(page, 'pivot-0-sales')).toStrictEqual([]);
    });
});
