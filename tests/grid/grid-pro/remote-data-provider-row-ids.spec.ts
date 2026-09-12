import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

type Scenario = {
    withRowIds?: boolean;
    idColumn?: string;
    idColumnInResponse?: boolean;
};

/**
 * Builds a remote-backed grid whose responses can omit `rowIds` or the
 * configured `idColumn`, and records anything written to `console.warn`.
 */
async function setupRemoteGrid(
    page: Page,
    scenario: Scenario
): Promise<void> {
    await page.goto('/grid-pro/basic/overview');

    await page.evaluate(async (s: Scenario) => {
        (window as any).warnings = [];
        const originalWarn = console.warn.bind(console);
        console.warn = (...args: unknown[]): void => {
            (window as any).warnings.push(args.join(' '));
            originalWarn(...args);
        };

        document.body.innerHTML =
            '<div id="container" style="height: 240px;"></div>';

        const data: Record<string, unknown> = {
            providerType: 'remote',
            chunkSize: 2,
            fetchCallback: (
                _query: unknown,
                offset: number,
                limit: number
            ): unknown => {
                const ids = Array.from(
                    { length: limit },
                    (_, i) => i + offset
                );
                const columns: Record<string, unknown> = {
                    name: ids.map((i) => 'name-' + i)
                };

                if (s.idColumnInResponse !== false) {
                    columns.id = ids.map((i) => 'row-' + i);
                }

                const result: Record<string, unknown> = {
                    columns,
                    totalRowCount: 6
                };

                if (s.withRowIds) {
                    result.rowIds = ids.map((i) => 'server-' + i);
                }

                return result;
            }
        };

        if (s.idColumn) {
            data.idColumn = s.idColumn;
        }

        (window as any).grid = await (window as any).Grid.grid(
            'container',
            { data },
            true
        );
    }, scenario);

    await page.waitForFunction(
        () => document.querySelectorAll('tbody td').length > 0
    );
}

function positionalWarnings(page: Page): Promise<string[]> {
    return page.evaluate(() => ((window as any).warnings as string[])
        .filter((w) => w.includes('derived from row positions')));
}

test.describe('Remote data provider row ids', () => {
    test('Warns when ids fall back to row positions', async ({ page }) => {
        await setupRemoteGrid(page, {});

        const warnings = await positionalWarnings(page);
        expect(warnings).toHaveLength(1);
        expect(warnings[0]).toContain('no `data.idColumn` is set');
        expect(warnings[0]).toContain('sorting or filtering moves');
    });

    test('Warns only once across several chunk fetches',
        async ({ page }) => {
            await setupRemoteGrid(page, {});

            // chunkSize is 2 over 6 rows, so reach into further chunks.
            await page.evaluate(async () => {
                const dp = (window as any).grid.dataProvider;
                await dp.getValue('name', 0);
                await dp.getValue('name', 3);
                await dp.getValue('name', 5);
            });

            expect(await positionalWarnings(page)).toHaveLength(1);
        });

    test('Stays silent when the response carries rowIds',
        async ({ page }) => {
            await setupRemoteGrid(page, { withRowIds: true });
            expect(await positionalWarnings(page)).toEqual([]);
        });

    test('Stays silent when idColumn resolves', async ({ page }) => {
        await setupRemoteGrid(page, { idColumn: 'id' });
        expect(await positionalWarnings(page)).toEqual([]);
    });

    test('Names the configured idColumn when the response omits it',
        async ({ page }) => {
            await setupRemoteGrid(page, {
                idColumn: 'id',
                idColumnInResponse: false
            });

            const warnings = await positionalWarnings(page);
            expect(warnings).toHaveLength(1);
            expect(warnings[0]).toContain('"id"');
            expect(warnings[0]).toContain('does not contain');
        });
});
