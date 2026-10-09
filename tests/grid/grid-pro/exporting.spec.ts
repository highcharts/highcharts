import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

async function getCSV(
    page: Page,
    columns: Record<string, unknown[]>,
    dataTypes: Record<string, string>
): Promise<string> {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            </head>
            <body><div id="container"></div></body>
        </html>
    `, { waitUntil: 'networkidle' });

    return page.evaluate(async (
        [cols, types]: [Record<string, unknown[]>, Record<string, string>]
    ): Promise<string> => {
        const grid = await (window as any).Grid.grid('container', {
            data: { columns: cols },
            columns: Object.keys(cols).map((id): object => ({
                id,
                dataType: types[id]
            }))
        }, true);

        return grid.exporting.getCSV();
    }, [columns, dataTypes]);
}

test.describe('Grid Pro - CSV export escaping', () => {
    test('Quotes are doubled so the file stays parsable', async ({ page }) => {
        const csv = await getCSV(page, {
            'say "hi"': ['He said "hi"', 'a,b', 'a\nb']
        }, { 'say "hi"': 'string' });

        expect(csv.split('\n')[0]).toBe('"say ""hi"""');
        expect(csv).toContain('"He said ""hi"""');
        // A delimiter and a newline were already covered by the quoting.
        expect(csv).toContain('"a,b"');
        expect(csv).toContain('"a\nb"');
    });

    test('Formula triggers are neutralized', async ({ page }) => {
        const csv = await getCSV(page, {
            v: ['=1+1', '@SUM(A1)', '\t=1+1', '-1+1+cmd|\' /C calc\'!A0']
        }, { v: 'string' });

        const rows = csv.split('\n').slice(1);
        expect(rows[0]).toBe('"\'=1+1"');
        expect(rows[1]).toBe('"\'@SUM(A1)"');
        expect(rows[2]).toBe('"\'\t=1+1"');
        expect(rows[3]).toBe('"\'-1+1+cmd|\' /C calc\'!A0"');
    });

    test('Numbers keep their sign, in both column types', async ({ page }) => {
        const csv = await getCSV(page, {
            s: ['-5', '+5', '-0.5', '1e3'],
            n: [-5, 5, -0.5, 1000]
        }, { s: 'string', n: 'number' });

        // A leading `-` or `+` on a plain number must not gain an
        // apostrophe, or every round trip through the export corrupts it.
        const rows = csv.split('\n').slice(1);
        expect(rows[0]).toBe('"-5",-5');
        expect(rows[1]).toBe('"+5",5');
        expect(rows[2]).toBe('"-0.5",-0.5');
        expect(rows[3]).toBe('"1e3",1000');
    });
});
