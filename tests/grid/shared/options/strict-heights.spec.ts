import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

async function loadGrid(page: Page): Promise<void> {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css">
            </head>
            <body>
                <div id="strict" style="height: 400px"></div>
                <div id="loose" style="height: 400px"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });
}

test.describe('Grid rows strictHeights', () => {
    test('Rows keep the same height and scroll smoothly', async ({ page }) => {
        await loadGrid(page);

        const result = await page.evaluate(async () => {
            const { Grid } = (window as any);
            const names: string[] = [];

            // Every third row is taller than one line, despite nowrap.
            for (let i = 0; i < 300; i++) {
                names.push(i % 3 === 1 ? 'Line 1<br>Line 2' : 'Name ' + i);
            }

            const grid = await Grid.grid('strict', {
                data: {
                    columns: { name: names }
                },
                rendering: {
                    rows: { strictHeights: true }
                },
                columns: [{
                    id: 'name',
                    cells: { format: '{value}' }
                }]
            }, true);

            const vp = grid.viewport;
            const tbody = vp.tbodyElement as HTMLElement;
            const getTops = (): Record<number, number> => {
                const tops: Record<number, number> = {};
                for (const row of vp.rows) {
                    tops[row.index] =
                        row.htmlElement.getBoundingClientRect().top;
                }
                return tops;
            };
            const step = 5;
            const jumps: number[] = [];
            let prevTops = getTops();

            for (let scrollTop = step; scrollTop <= 1500; scrollTop += step) {
                tbody.scrollTop = scrollTop;
                await new Promise((resolve): void => {
                    requestAnimationFrame((): void => {
                        requestAnimationFrame(resolve);
                    });
                });
                const tops = getTops();
                for (const index in tops) {
                    if (
                        index in prevTops &&
                        Math.abs(tops[index] - prevTops[index] + step) > 1
                    ) {
                        jumps.push(scrollTop);
                        break;
                    }
                }
                prevTops = tops;
            }

            return {
                defaultHeight: vp.rowsVirtualizer.defaultRowHeight,
                heights: vp.rows.map(
                    (row: any): number => row.htmlElement.offsetHeight
                ),
                jumps
            };
        });

        expect(result.jumps, 'rows should not jump while scrolling')
            .toEqual([]);
        for (const height of result.heights) {
            expect(height).toBe(result.defaultHeight);
        }
    });

    test('Default row height matches the natural row height', async ({ page }) => {
        await loadGrid(page);

        const heights = await page.evaluate(async () => {
            const { Grid } = (window as any);
            const options = (strictHeights: boolean): object => ({
                data: {
                    columns: {
                        name: Array.from(
                            { length: 100 },
                            (_, i): string => 'Name ' + i
                        )
                    }
                },
                rendering: {
                    rows: { strictHeights }
                }
            });

            const strict = await Grid.grid('strict', options(true), true);
            const loose = await Grid.grid('loose', options(false), true);

            return [strict, loose].map(
                (grid: any): number =>
                    grid.viewport.rows[0].htmlElement.offsetHeight
            );
        });

        expect(heights[0]).toBe(heights[1]);
    });
});
