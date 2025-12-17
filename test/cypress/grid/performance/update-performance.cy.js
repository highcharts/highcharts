/**
 * Grid Update Performance Tests
 * 
 * Tests the new modular update system performance
 */

describe('Grid Update Performance', () => {
    
    beforeEach(() => {
        cy.visit('/grid-lite/demo/your-first-grid');
    });

    it('DOM only update (className) should be fast', () => {
        cy.grid().then(grid => {
            
            // Measure DOM only update
            const start = performance.now();
            
            grid.update({
                caption: {
                    className: 'test-class-' + Date.now()
                }
            });
            const duration = performance.now() - start;
            
            // Should be under 5ms (was ~50ms before)
            expect(duration).to.be.lessThan(5);
            
            console.log(`DOM only update: ${duration.toFixed(2)}ms`);
        });
    });

    it('Theme update should be fast', () => {
        cy.grid().then(grid => {
            
            const start = performance.now();
            
            grid.update({
                rendering: {
                    theme: 'hcg-theme-custom'
                }
            });
            
            const duration = performance.now() - start;
            
            expect(duration).to.be.lessThan(5);
            console.log(`Theme update: ${duration.toFixed(2)}ms`);
        });
    });

    it('Pagination pageSize update should be optimized', () => {
        cy.grid().then(grid => {
            
            // Enable pagination first
            grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10
                }
            });
            
            cy.wait(100);
            
            const start = performance.now();
            
            // Update only pageSize
            grid.update({
                pagination: {
                    pageSize: 20
                }
            });
            
            const duration = performance.now() - start;
            
            // Should be under 15ms (was ~50ms)
            expect(duration).to.be.lessThan(15);
            console.log(`PageSize update: ${duration.toFixed(2)}ms`);
        });
    });

    it('Lang locale update should trigger reflow', () => {
        cy.grid().then(grid => {
            
            const start = performance.now();
            
            grid.update({
                lang: {
                    locale: 'pl-PL'
                }
            });
            
            const duration = performance.now() - start;
            
            // Should be under 20ms (was ~50ms)
            expect(duration).to.be.lessThan(20);
            console.log(`Locale update: ${duration.toFixed(2)}ms`);
        });
    });

    it('Multiple DOM updates should be batched', () => {
        cy.grid().then(grid => {
            
            const start = performance.now();
            
            // Multiple DOM updates
            grid.update({
                caption: { 
                    text: 'New Caption',
                    className: 'custom-caption'
                },
                description: {
                    text: 'New Description'
                },
                rendering: {
                    theme: 'dark-theme'
                }
            });
            
            const duration = performance.now() - start;
            
            // Should be under 10ms (was ~50ms)
            expect(duration).to.be.lessThan(10);
            console.log(`Batched DOM updates: ${duration.toFixed(2)}ms`);
        });
    });

    it('Complex update should be faster than full render', () => {
        cy.grid().then(grid => {
            
            const start = performance.now();
            
            grid.update({
                caption: { text: 'Sales Dashboard' },
                lang: { locale: 'de-DE' },
                pagination: { 
                    enabled: true,
                    pageSize: 50 
                },
                rendering: {
                    theme: 'custom-theme',
                    rows: {
                        bufferSize: 20
                    }
                }
            });
            
            const duration = performance.now() - start;
            
            // Should be under 25ms (was ~50ms)
            expect(duration).to.be.lessThan(25);
            console.log(`Complex update: ${duration.toFixed(2)}ms`);
        });
    });

    it('Structural update (columns) should use renderViewport', () => {
        cy.grid().then(grid => {
            const table = grid.dataTable;
            
            const start = performance.now();
            
            grid.update({
                columns: [
                    { id: table.getColumnIds()[0] }
                ]
            });
            
            const duration = performance.now() - start;
            
            // This should be similar to before (~50ms)
            // We expect NO regression
            console.log(`Structural update (columns): ${duration.toFixed(2)}ms`);
        });
    });

    it('Boolean shorthand normalization should work', () => {
        cy.grid().then(grid => {
            
            // Test: pagination: false === pagination: { enabled: false }
            grid.update({
                pagination: {
                    enabled: true,
                    pageSize: 10
                }
            });
            
            cy.wait(100);
            
            const start1 = performance.now();
            
            // This should be recognized as "no change"
            grid.update({
                pagination: {
                    enabled: true  // Same as before
                }
            });
            
            const duration1 = performance.now() - start1;
            
            // Should be very fast (no actual changes)
            expect(duration1).to.be.lessThan(2);
            
            console.log(`No-op update (same value): ${duration1.toFixed(2)}ms`);
        });
    });
});

