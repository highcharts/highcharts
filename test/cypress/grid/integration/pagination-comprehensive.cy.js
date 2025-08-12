describe('Pagination Comprehensive Tests', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/pagination/basic-pagination');
    });

    it('Render basic pagination with pageSize option', () => {
        // Check pagination wrapper is visible
        cy.get('.hcg-pagination-wrapper').should('be.visible');

        // Check page info is displayed with correct initial page size
        cy.get('.hcg-pagination-info').should('be.visible');
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 8 of 25');

        // Check navigation buttons exist
        cy.get('.hcg-pagination-nav').should('be.visible');
        
        // Check first/last buttons
        cy.get('.hcg-pagination-btn').should('have.length.at.least', 4);
        
        // Check page size selector with correct initial value
        cy.get('.hcg-pagination-items-per-page-select').should('be.visible');
        cy.get('.hcg-pagination-items-per-page-select').should('have.value', '8');

        // Check page number buttons
        cy.get('.hcg-pagination-page').should('have.length.at.least', 1);
        cy.get('.hcg-pagination-page-active').should('contain', '1');

        // Check initial data rows (should be 8 due to pageSize option)
        cy.get('table tbody tr').should('have.length', 8);
    });

    //     it('should handle page navigation', () => {
    //         // Click next page button
    //         cy.get('.hcg-pagination-btn').contains('Next').click();
            
    //         // Check page info updates
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 9 - 16 of 25');
            
    //         // Check active page button updates
    //         cy.get('.hcg-pagination-page-active').should('contain', '2');
            
    //         // Check data rows update
    //         cy.get('table tbody tr').should('have.length', 8);
            
    //         // Check event logging
    //         cy.get('#events').should('contain', 'Before page change: 1 → 2');
    //         cy.get('#events').should('contain', 'After page change: Now on page 2');

    //         // Click previous button
    //         cy.get('.hcg-pagination-btn').contains('Previous').click();
            
    //         // Check we're back on page 1
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 8 of 25');
    //         cy.get('.hcg-pagination-page-active').should('contain', '1');
    //     });

    //     it('should handle page size changes', () => {
    //         // Change page size to 10
    //         cy.get('.hcg-pagination-items-per-page-select').select('10');
            
    //         // Check page info updates
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 10 of 25');
            
    //         // Check data rows update
    //         cy.get('table tbody tr').should('have.length', 10);
            
    //         // Check event logging
    //         cy.get('#events').should('contain', 'Before page size change: 8 → 10');
    //         cy.get('#events').should('contain', 'After page size change: 8 → 10');

    //         // Change page size to 5
    //         cy.get('.hcg-pagination-items-per-page-select').select('5');
            
    //         // Check page info updates
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 5 of 25');
            
    //         // Check data rows update
    //         cy.get('table tbody tr').should('have.length', 5);
    //     });

    //     it('should handle first/last button navigation', () => {
    //         // Click last button to go to last page
    //         cy.get('.hcg-pagination-btn').contains('Last').click();
            
    //         // Check we're on the last page
    //         cy.get('.hcg-pagination-page-active').should('contain', '5');
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 21 - 25 of 25');
            
    //         // Check button states - last button should be disabled
    //         cy.get('.hcg-pagination-btn').contains('Last').should('be.disabled');
    //         cy.get('.hcg-pagination-btn').contains('First').should('not.be.disabled');
            
    //         // Click first button to go back to first page
    //         cy.get('.hcg-pagination-btn').contains('First').click();
            
    //         // Check we're back on first page
    //         cy.get('.hcg-pagination-page-active').should('contain', '1');
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 5 of 25');
    //     });

    //     it('should handle direct page number navigation', () => {
    //         // Click on page number 3
    //         cy.get('.hcg-pagination-page').contains('3').click();
            
    //         // Check we're on page 3
    //         cy.get('.hcg-pagination-page-active').should('contain', '3');
    //         cy.get('.hcg-pagination-info').should('contain', 'Showing 11 - 15 of 25');
            
    //         // Check event logging
    //         cy.get('#events').should('contain', 'Before page change:');
    //         cy.get('#events').should('contain', 'After page change: Now on page 3');
    //     });

    //     it('should maintain data integrity during pagination', () => {
    //         // Check that data is consistent across pages
    //         cy.get('table tbody tr').first().should('contain', 'Alice');
            
    //         // Go to next page
    //         cy.get('.hcg-pagination-btn').contains('Next').click();
            
    //         // Check that data changed (should not contain Alice on page 2)
    //         cy.get('table tbody tr').first().should('not.contain', 'Alice');
            
    //         // Go back to first page
    //         cy.get('.hcg-pagination-btn').contains('Previous').click();
            
    //         // Check that data is back to original
    //         cy.get('table tbody tr').first().should('contain', 'Alice');
    //     });

    //     it('should handle button states at boundaries', () => {
    //         // Go to first page
    //         cy.get('.hcg-pagination-btn').contains('First').click();
            
    //         // First and Previous buttons should be disabled
    //         cy.get('.hcg-pagination-btn').contains('First').should('be.disabled');
    //         cy.get('.hcg-pagination-btn').contains('Previous').should('be.disabled');
            
    //         // Next and Last buttons should be enabled
    //         cy.get('.hcg-pagination-btn').contains('Next').should('not.be.disabled');
    //         cy.get('.hcg-pagination-btn').contains('Last').should('not.be.disabled');
            
    //         // Go to last page
    //         cy.get('.hcg-pagination-btn').contains('Last').click();
            
    //         // First and Previous buttons should be enabled
    //         cy.get('.hcg-pagination-btn').contains('First').should('not.be.disabled');
    //         cy.get('.hcg-pagination-btn').contains('Previous').should('not.be.disabled');
            
    //         // Next and Last buttons should be disabled
    //         cy.get('.hcg-pagination-btn').contains('Next').should('be.disabled');
    //         cy.get('.hcg-pagination-btn').contains('Last').should('be.disabled');
    //     });

    //     describe('Default Enhanced Pagination', () => {
    //         it('should render default enhanced pagination with all controls', () => {
    //             // Check pagination wrapper is visible
    //             cy.get('#default-container .hcg-pagination-wrapper').should('be.visible');

    //             // Check page info is displayed
    //             cy.get('#default-container .hcg-pagination-info').should('be.visible');
    //             cy.get('#default-container .hcg-pagination-info').should('contain', 'Showing 1 - 10 of 50');

    //             // Check navigation buttons exist
    //             cy.get('#default-container .hcg-pagination-nav').should('be.visible');
                
    //             // Check first/last buttons
    //             cy.get('#default-container .hcg-pagination-btn').should('have.length.at.least', 4);
                
    //             // Check page size selector
    //             cy.get('#default-container .hcg-pagination-items-per-page-select').should('be.visible');
    //             cy.get('#default-container .hcg-pagination-items-per-page-select').should('have.value', '10');

    //             // Check page number buttons
    //             cy.get('#default-container .hcg-pagination-page').should('have.length.at.least', 1);
    //             cy.get('#default-container .hcg-pagination-page-active').should('contain', '1');

    //             // Check initial data rows
    //             cy.get('#default-container table tbody tr').should('have.length', 10);
    //         });

    //         it('should handle page navigation correctly', () => {
    //             // Click next page button
    //             cy.get('#default-container .hcg-pagination-btn').contains('Next').click();
                
    //             // Check page info updates
    //             cy.get('#default-container .hcg-pagination-info').should('contain', 'Showing 11 - 20 of 50');
                
    //             // Check active page button updates
    //             cy.get('#default-container .hcg-pagination-page-active').should('contain', '2');
                
    //             // Check data rows update
    //             cy.get('#default-container table tbody tr').should('have.length', 10);
                
    //             // Check event logging
    //             cy.get('#default-events').should('contain', 'Before page change: 1 → 2');
    //             cy.get('#default-events').should('contain', 'After page change: Now on page 2');
    //         });

    //         it('should handle page size changes', () => {
    //             // Change page size to 20
    //             cy.get('#default-container .hcg-pagination-items-per-page-select').select('20');
                
    //             // Check page info updates
    //             cy.get('#default-container .hcg-pagination-info').should('contain', 'Showing 1 - 20 of 50');
                
    //             // Check data rows update
    //             cy.get('#default-container table tbody tr').should('have.length', 20);
                
    //             // Check event logging
    //             cy.get('#default-events').should('contain', 'Before page size change: 10 → 20');
    //             cy.get('#default-events').should('contain', 'After page size change: 10 → 20');
    //         });
    //     });

    //     describe('Customized Pagination', () => {
    //         it('should render customized pagination with custom settings', () => {
    //             // Check pagination wrapper is visible
    //             cy.get('#custom-container .hcg-pagination-wrapper').should('be.visible');

    //             // Check custom page info text
    //             cy.get('#custom-container .hcg-pagination-info').should('contain', 'Page 1 to 5 of 30 items');

    //             // Check that first/last buttons are disabled (customized to false)
    //             cy.get('#custom-container .hcg-pagination-btn').should('not.contain', 'First');
    //             cy.get('#custom-container .hcg-pagination-btn').should('not.contain', 'Last');

    //             // Check page size selector with custom options
    //             cy.get('#custom-container .hcg-pagination-items-per-page-select').should('have.value', '5');
    //             cy.get('#custom-container .hcg-pagination-items-per-page-select option').should('have.length', 4);

    //             // Check initial data rows (custom page size of 5)
    //             cy.get('#custom-container table tbody tr').should('have.length', 5);
    //         });

    //         it('should handle navigation with custom configuration', () => {
    //             // Click next page button
    //             cy.get('#custom-container .hcg-pagination-btn').contains('Next').click();
                
    //             // Check page info updates with custom format
    //             cy.get('#custom-container .hcg-pagination-info').should('contain', 'Page 6 to 10 of 30 items');
                
    //             // Check event logging with custom prefix
    //             cy.get('#custom-events').should('contain', 'Custom: Before page change: 1 → 2');
    //             cy.get('#custom-events').should('contain', 'Custom: After page change: Now on page 2');
    //         });
    //     });

    //     describe('PageSize Selector Functionality', () => {
    //         it('should handle page size selector changes correctly', () => {
    //             // Check initial state
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 1 - 15 of 100');
    //             cy.get('#pagesize-container table tbody tr').should('have.length', 15);

    //             // Change to 25 items per page
    //             cy.get('#pagesize-container .hcg-pagination-items-per-page-select').select('25');
                
    //             // Check page info updates
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 1 - 25 of 100');
                
    //             // Check data rows update
    //             cy.get('#pagesize-container table tbody tr').should('have.length', 25);
                
    //             // Check event logging
    //             cy.get('#pagesize-events').should('contain', 'Before page size change: 15 → 25');
    //             cy.get('#pagesize-events').should('contain', 'After page size change: 15 → 25');

    //             // Change to 50 items per page
    //             cy.get('#pagesize-container .hcg-pagination-items-per-page-select').select('50');
                
    //             // Check page info updates
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 1 - 50 of 100');
                
    //             // Check data rows update
    //             cy.get('#pagesize-container table tbody tr').should('have.length', 50);
    //         });

    //         it('should maintain page state when changing page size', () => {
    //             // Navigate to page 2 first
    //             cy.get('#pagesize-container .hcg-pagination-btn').contains('Next').click();
    //             cy.get('#pagesize-container .hcg-pagination-page-active').should('contain', '2');
                
    //             // Change page size to 10
    //             cy.get('#pagesize-container .hcg-pagination-items-per-page-select').select('10');
                
    //             // Should still be on page 2, but showing different range
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 11 - 20 of 100');
    //             cy.get('#pagesize-container .hcg-pagination-page-active').should('contain', '2');
    //         });
    //     });

    //     describe('First/Last Buttons Functionality', () => {
    //         it('should handle first/last button navigation', () => {
    //             // Check initial state - first button should be disabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').should('be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').should('not.be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '1');

    //             // Click last button to go to last page
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').click();
                
    //             // Check we're on the last page
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '10');
    //             cy.get('#buttons-container .hcg-pagination-info').should('contain', 'Showing 73 - 75 of 75');
                
    //             // Check button states - last button should be disabled, first should be enabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').should('not.be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').should('be.disabled');
                
    //             // Check event logging
    //             cy.get('#buttons-events').should('contain', 'Buttons: Before page change: 1 → 10');
    //             cy.get('#buttons-events').should('contain', 'Buttons: After page change: Now on page 10');

    //             // Click first button to go back to first page
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').click();
                
    //             // Check we're back on first page
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '1');
    //             cy.get('#buttons-container .hcg-pagination-info').should('contain', 'Showing 1 - 8 of 75');
    //         });

    //         it('should handle prev/next button navigation', () => {
    //             // Click next button
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Next').click();
                
    //             // Check we're on page 2
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '2');
    //             cy.get('#buttons-container .hcg-pagination-info').should('contain', 'Showing 9 - 16 of 75');
                
    //             // Click previous button
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Previous').click();
                
    //             // Check we're back on page 1
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '1');
    //             cy.get('#buttons-container .hcg-pagination-info').should('contain', 'Showing 1 - 8 of 75');
    //         });

    //         it('should handle button states correctly at boundaries', () => {
    //             // Go to first page
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').click();
                
    //             // First and Previous buttons should be disabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').should('be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Previous').should('be.disabled');
                
    //             // Next and Last buttons should be enabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Next').should('not.be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').should('not.be.disabled');
                
    //             // Go to last page
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').click();
                
    //             // First and Previous buttons should be enabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('First').should('not.be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Previous').should('not.be.disabled');
                
    //             // Next and Last buttons should be disabled
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Next').should('be.disabled');
    //             cy.get('#buttons-container .hcg-pagination-btn').contains('Last').should('be.disabled');
    //         });
    //     });

    //     describe('Page Number Buttons', () => {
    //         it('should handle direct page number navigation', () => {
    //             // Click on page number 3
    //             cy.get('#default-container .hcg-pagination-page').contains('3').click();
                
    //             // Check we're on page 3
    //             cy.get('#default-container .hcg-pagination-page-active').should('contain', '3');
    //             cy.get('#default-container .hcg-pagination-info').should('contain', 'Showing 21 - 30 of 50');
                
    //             // Check event logging
    //             cy.get('#default-events').should('contain', 'Before page change:');
    //             cy.get('#default-events').should('contain', 'After page change: Now on page 3');
    //         });

    //         it('should show correct page numbers with ellipsis', () => {
    //             // Navigate to a middle page to see ellipsis
    //             cy.get('#buttons-container .hcg-pagination-page').contains('5').click();
                
    //             // Check we're on page 5
    //             cy.get('#buttons-container .hcg-pagination-page-active').should('contain', '5');
                
    //             // Should show ellipsis for pages beyond the count limit
    //             cy.get('#buttons-container .hcg-pagination-ellipsis').should('be.visible');
    //         });
    //     });

    //     describe('Integration Tests', () => {
    //         it('should handle complex pagination scenarios', () => {
    //             // Test page size change followed by navigation
    //             cy.get('#pagesize-container .hcg-pagination-items-per-page-select').select('25');
    //             cy.get('#pagesize-container .hcg-pagination-btn').contains('Next').click();
    //             cy.get('#pagesize-container .hcg-pagination-btn').contains('Next').click();
                
    //             // Should be on page 3 with 25 items per page
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 51 - 75 of 100');
    //             cy.get('#pagesize-container .hcg-pagination-page-active').should('contain', '3');
                
    //             // Change page size back to 10
    //             cy.get('#pagesize-container .hcg-pagination-items-per-page-select').select('10');
                
    //             // Should adjust to show correct range for page 3 with 10 items per page
    //             cy.get('#pagesize-container .hcg-pagination-info').should('contain', 'Showing 21 - 30 of 100');
    //         });

    //         it('should maintain data integrity during pagination', () => {
    //             // Check that data is consistent across pages
    //             cy.get('#default-container table tbody tr').first().should('contain', 'Alice');
                
    //             // Go to next page
    //             cy.get('#default-container .hcg-pagination-btn').contains('Next').click();
                
    //             // Check that data changed (should not contain Alice on page 2)
    //             cy.get('#default-container table tbody tr').first().should('not.contain', 'Alice');
                
    //             // Go back to first page
    //             cy.get('#default-container .hcg-pagination-btn').contains('Previous').click();
                
    //             // Check that data is back to original
    //             cy.get('#default-container table tbody tr').first().should('contain', 'Alice');
    //         });
    //     });
    // });
});
