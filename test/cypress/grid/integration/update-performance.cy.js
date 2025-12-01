describe('Update performance.', () => {
    beforeEach(() => {
        cy.viewport(1200, 600);
        cy.visit('grid-pro/cypress/update-performance');
    });

    it('Performance update: columns[].sorting.order', () => {
        cy.grid().then(async grid => {
            const memoryBefore = performance.memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    sorting: {
                        order: 'asc',
                    }
                }]
            });

            performance.mark('End');

            const memoryAfter = performance.memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            expect(memoryDelta).to.be.lessThan(250000);

            const duration =
                performance.measure('Start-end', 'Start', 'End').duration;
            expect(duration).to.be.lessThan(10);
        });
    });

    it('Performance update: columns[].filtering.condition and value', () => {
        cy.grid().then(async grid => {
            const memoryBefore = performance.memory?.usedJSHeapSize || 0;
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

            const memoryAfter = performance.memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            expect(memoryDelta).to.be.lessThan(300000);

            const duration =
                performance.measure('Start-end', 'Start', 'End').duration;
            expect(duration).to.be.lessThan(15);
        });
    });

    it('Performance update: columns[].width', () => {
        cy.grid().then(async grid => {
            const memoryBefore = performance.memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                columns: [{
                    id: 'product',
                    width: 700
                }]
            });
            performance.mark('End');

            const memoryAfter = performance.memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            expect(memoryDelta).to.be.lessThan(50000);

            const duration =
                performance.measure('Start-end', 'Start', 'End').duration;
            expect(duration).to.be.lessThan(7);
        });
    });

    it('Performance update: pagination.page and pageSize', () => {
        cy.grid().then(async grid => {
            await grid.update({
                pagination: {
                    enabled: true,
                }
            });

            const memoryBefore = performance.memory?.usedJSHeapSize || 0;
            performance.mark('Start');

            await grid.update({
                pagination: {
                    pageSize: 3,
                    page: 2
                }
            });
            performance.mark('End');

            const memoryAfter = performance.memory?.usedJSHeapSize || 0;
            const memoryDelta = memoryAfter - memoryBefore;
            expect(memoryDelta).to.be.lessThan(150000);

            const duration =
                performance.measure('Start-end', 'Start', 'End').duration;
            expect(duration).to.be.lessThan(10);
        });
    });
});
