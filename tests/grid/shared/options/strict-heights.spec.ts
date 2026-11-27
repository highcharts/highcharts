import { test, expect } from '~/fixtures.ts';

test.describe('Grid rows strictHeights', () => {
    test('Rows of different heights scroll without jumps', async ({ page }) => {
        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                    <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css">
                </head>
                <body>
                    <div id="container" style="height: 400px"></div>
                </body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const { Grid } = (window as any);
            const names: string[] = [];

            // Every third row is taller than one line, despite nowrap.
            for (let i = 0; i < 300; i++) {
                names.push(i % 3 === 1 ? 'A<br>B<br>C' : 'Name ' + i);
            }

            const grid = await Grid.grid('container', {
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
            const step = 5;
            const getTops = (): Record<number, number> => {
                const tops: Record<number, number> = {};
                for (const row of vp.rows) {
                    tops[row.index] =
                        row.htmlElement.getBoundingClientRect().top;
                }
                return tops;
            };
            const jumps: string[] = [];
            let prevTops = getTops();

            const scrollTo = async (scrollTop: number): Promise<void> => {
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
                        Math.abs(tops[index] - prevTops[index]) > 2 * step
                    ) {
                        jumps.push(`row ${index} at ${scrollTop}`);
                        break;
                    }
                }
                prevTops = tops;
            };

            for (let scrollTop = step; scrollTop <= 1500; scrollTop += step) {
                await scrollTo(scrollTop);
            }
            for (let scrollTop = 1500; scrollTop >= 0; scrollTop -= step) {
                await scrollTo(scrollTop);
            }

            return {
                defaultHeight: vp.rowsVirtualizer.defaultRowHeight,
                tallHeight: vp.rows.find(
                    (row: any): boolean => row.index % 3 === 1
                ).htmlElement.offsetHeight,
                jumps
            };
        });

        expect(result.jumps, 'rows should not jump while scrolling')
            .toEqual([]);
        expect(
            result.tallHeight,
            'taller rows should keep their height'
        ).toBeGreaterThan(result.defaultHeight);
    });
});
