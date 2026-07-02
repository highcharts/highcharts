import { test, expect } from '~/fixtures.ts';

test.describe('Update performance', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 600 });
        await page.goto('grid-pro/e2e/update-performance', { waitUntil: 'networkidle' });
        
        // Wait for Grid to be fully initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0 &&
                   (window as any).Grid.grids[0].viewport;
        }, { timeout: 10000 });
        
        // Small delay to ensure stable state before measurements
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(100);
    });

    test('Performance update: columns[].sorting.order', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            
            // Warm-up run to stabilize JIT, cache, and GC
            await grid.update({
                columns: [{
                    id: 'product',
                    sorting: {
                        order: 'asc'
                    }
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Reset to initial state
            await grid.update({
                columns: [{
                    id: 'product',
                    sorting: {
                        order: 'desc'
                    }
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Force garbage collection if available (Chrome DevTools)
            if ((window as any).gc) {
                (window as any).gc();
            }
            
            // Wait a bit for GC to complete
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryBefore =
                (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    sorting: {
                        order: 'asc'
                    }
                }]
            });

            // Wait for update to complete and DOM to settle
            await new Promise(resolve => setTimeout(resolve, 10));
            
            performance.mark('End');

            // Wait a bit before measuring memory to allow GC
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryAfter =
                (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        // Increased tolerance for stability across different browsers
        expect(result.memoryDelta).toBeLessThan(500000);
        expect(result.duration).toBeLessThan(35); // ms (Firefox can be slower)
    });

    test('Performance update: columns[].filtering.condition and value', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            
            // Warm-up run to stabilize JIT, cache, and GC
            await grid.update({
                columns: [{
                    id: 'product',
                    filtering: {
                        condition: 'beginsWith',
                        value: 'A'
                    }
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Reset to initial state
            await grid.update({
                columns: [{
                    id: 'product',
                    filtering: {
                        condition: 'contains',
                        value: ''
                    }
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Force garbage collection if available
            if ((window as any).gc) {
                (window as any).gc();
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryBefore =
                (performance as any).memory?.usedJSHeapSize || 0;
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

            await new Promise(resolve => setTimeout(resolve, 10));
            performance.mark('End');

            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryAfter =
                (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        // Increased tolerance for stability across different browsers
        expect(result.memoryDelta).toBeLessThan(550000);
        expect(result.duration).toBeLessThan(40); // ms (Firefox can be slower)
    });

    test('Performance update: columns[].width', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            
            // Warm-up run to stabilize JIT, cache, and GC
            await grid.update({
                columns: [{
                    id: 'product',
                    width: 700
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Reset to initial state (get original width)
            const originalWidth = grid.viewport.getColumn('product')?.width || 200;
            await grid.update({
                columns: [{
                    id: 'product',
                    width: originalWidth
                }]
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Force garbage collection if available
            if ((window as any).gc) {
                (window as any).gc();
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryBefore =
                (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    width: 700
                }]
            });

            await new Promise(resolve => setTimeout(resolve, 10));
            performance.mark('End');

            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryAfter =
                (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        // Increased tolerance for stability across different browsers
        expect(result.memoryDelta).toBeLessThan(750000);
        expect(result.duration).toBeLessThan(40); // ms (Firefox can be slower)
    });

    test('Performance update: pagination.page and pageSize', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const grid = (window as any).Grid.grids[0];
            await grid.update({
                pagination: {
                    enabled: true
                }
            });

            // Wait for pagination to be fully initialized
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Warm-up run to stabilize JIT, cache, and GC
            await grid.update({
                pagination: {
                    pageSize: 3,
                    page: 2
                }
            });
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Reset to initial state
            await grid.update({
                pagination: {
                    pageSize: 10,
                    page: 1
                }
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Force garbage collection if available
            if ((window as any).gc) {
                (window as any).gc();
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));

            const memoryBefore =
                (performance as any).memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                pagination: {
                    pageSize: 3,
                    page: 2
                }
            });

            await new Promise(resolve => setTimeout(resolve, 10));
            performance.mark('End');

            await new Promise(resolve => setTimeout(resolve, 50));
            
            const memoryAfter =
                (performance as any).memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            const duration = performance.measure('Start-end', 'Start', 'End').duration;

            return {
                memoryDelta,
                duration
            };
        });

        // Increased tolerance for stability across different browsers
        expect(result.memoryDelta).toBeLessThan(900000);
        expect(result.duration).toBeLessThan(35); // ms (Firefox can be slower)
    });
});

