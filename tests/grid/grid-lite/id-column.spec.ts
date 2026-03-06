import { test, expect } from '~/fixtures.ts';

const gridLiteHtml = `
<!DOCTYPE html>
<html>
    <head>
        <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
        <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
    </head>
    <body>
        <div id="container"></div>
    </body>
</html>
`;

test.describe('LocalDataProvider idColumn', () => {
    test('without idColumn: getRowId returns original row index', async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ['a', 'b', 'c'],
                        name: ['Alice', 'Bob', 'Carol']
                    }
                }
            }, true);
            const dp = grid?.dataProvider;
            return dp ? {
                rowId0: await dp.getRowId(0),
                rowIndex1: await dp.getRowIndex(1)
            } : { error: 'no-provider' };
        });

        expect(result.error).toBeUndefined();
        expect(result.rowId0).toBe(0);
        expect(result.rowIndex1).toBe(1);
    });

    test('with idColumn: getRowId and getRowIndex use column values', async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ['user-1', 'user-2', 'user-3'],
                        name: ['Alice', 'Bob', 'Carol']
                    },
                    idColumn: 'id'
                }
            }, true);
            const dp = grid?.dataProvider;
            return dp ? {
                rowId0: await dp.getRowId(0),
                rowIndex2: await dp.getRowIndex('user-2')
            } : { error: 'no-provider' };
        });

        expect(result.error).toBeUndefined();
        expect(result.rowId0).toBe('user-1');
        expect(result.rowIndex2).toBe(1);
    });

    test('with idColumn: setValue updates row by row ID', async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        id: ['r1', 'r2', 'r3'],
                        name: ['A', 'B', 'C']
                    },
                    idColumn: 'id'
                }
            }, true);
            const dp = grid?.dataProvider;
            if (!dp) {
                return { error: 'no-provider' };
            };
            await dp.setValue('B-updated', 'name', 'r2');
            return { valueAfter: await dp.getValue('name', 1) };
        });

        expect(result.error).toBeUndefined();
        expect(result.valueAfter).toBe('B-updated');
    });
});
