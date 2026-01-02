import { test, expect } from '~/fixtures.ts';

test.describe('Update performance', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 600 });
        await page.goto('grid-pro/cypress/update-performance');
    });

    test('Performance update: columns[].sorting.order', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    sorting: {
                        order: 'asc'
                    }
                }]
            });

            performance.mark('End');

            const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        expect(result.memoryDelta).toBeLessThan(350000);
        expect(result.duration).toBeLessThan(15);
    });

    test('Performance update: columns[].filtering.condition and value', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    filtering: {
                        condition: 'beginsWith',
                        value: 'A'
                    }
                }]
            });
            performance.mark('End');

            const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        expect(result.memoryDelta).toBeLessThan(400000);
        expect(result.duration).toBeLessThan(20);
    });

    test('Performance update: columns[].width', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    width: 700
                }]
            });
            performance.mark('End');

            const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        expect(result.memoryDelta).toBeLessThan(600000);
        expect(result.duration).toBeLessThan(10);
    });

    test('Performance update: pagination.page and pageSize', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            await grid.update({
                pagination: {
                    enabled: true
                }
            });

            const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                pagination: {
                    pageSize: 3,
                    page: 2
                }
            });
            performance.mark('End');

            const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        expect(result.memoryDelta).toBeLessThan(750000);
        expect(result.duration).toBeLessThan(15);
    });
});

