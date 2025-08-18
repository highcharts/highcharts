describe('Pagination.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/pagination');
    });

    it('Render pagination container.', () => {
        // Check pagination wrapper is visible
        cy.get('.hcg-pagination-wrapper').should('be.visible');

        // Check page info is displayed with correct initial page size
        cy.get('.hcg-pagination-info').should('be.visible');
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1');

        // Check controls buttons exist
        cy.get('.hcg-pagination-controls').should('be.visible');
        
        // Check first/last buttons
        cy.get('.hcg-pagination-btn').should('have.length.at.least', 4);
        
        // Check page size selector with correct initial value
        cy.get('.hcg-pagination-page-size-select').should('be.visible');

        // Check page number buttons
        cy.get('.hcg-pagination-page').should('have.length.at.least', 1);
        cy.get('.hcg-pagination-page-active').should('contain', '1');

        // Check initial data rows
        cy.get('table tbody tr').should('have.length', 21);
    });

    it('Next/previous button.', () => {
        // Click next page button
        cy.get('.hcg-pagination-btn[title="Next page"]').click();

        // Check page info updates
        cy.get('.hcg-pagination-info').should('contain', 'Showing 23');

        // Check active page button updates
        cy.get('.hcg-pagination-page-active').should('contain', '2');

        // Check data rows update
        cy.get('table tbody tr').should('have.length', 21);

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '1');
        cy.get('#afterPageChange').should('have.value', '2');

        // Click previous button
        cy.get('.hcg-pagination-btn[title="Previous page"]').click();

        // Check we're back on page 1
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1');
        cy.get('.hcg-pagination-page-active').should('contain', '1');

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '2');
        cy.get('#afterPageChange').should('have.value', '1');
    });

    it('First/last button', () => {
        // Click last button to go to last page
        cy.get('.hcg-pagination-btn[title="Last page"]').click();

        // Check we're on the last page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 243 - 254 of 254');

        // Check button states - last button should be disabled
        cy.get('.hcg-pagination-btn[title="Last page"]').should('be.disabled');
        cy.get('.hcg-pagination-btn[title="Next page"]').should('be.disabled');
        cy.get('.hcg-pagination-btn[title="First page"]').should('not.be.disabled');
        cy.get('.hcg-pagination-btn[title="Previous page"]').should('not.be.disabled');

        // // Click first button to go back to first page
        cy.get('.hcg-pagination-btn[title="First page"]').click();
        cy.get('.hcg-pagination-btn[title="Last page"]').should('not.be.disabled');
        cy.get('.hcg-pagination-btn[title="Next page"]').should('not.be.disabled');

        // // Check we're back on first page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 22 of 254');
    });

    it('Direct page number.', () => {
        // Click on page number
        cy.get('.hcg-pagination-page').contains('3').click();

        // Check we're on page
        cy.get('.hcg-pagination-info').should('contain', 'Showing 45 - 66 of 254');

        // Check event logging
        cy.get('#beforePageChange').should('have.value', '1');
        cy.get('#afterPageChange').should('have.value', '3');
    });

    it('Page size', () => {
        // Change page size to 10
        cy.get('.hcg-pagination-page-size-select').eq(0).select('20');

        // Check page info updates
        cy.get('.hcg-pagination-info').should('contain', 'Showing 1 - 20');

        // Check data rows update
        cy.get('table tbody tr').should('have.length', 20);

        // // Check event logging
        cy.get('#beforePageSizeChange').should('have.value', '22');
        cy.get('#afterPageSizeChange').should('have.value', '20');
    });

    it('Update pagination.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                pagination: {
                    enabled: false
                }
            });

            cy.get('.hcg-pagination-wrapper').should('not.exist');
        });

        cy.window().its('Grid').then((grid) => {
            // Enable pagination
            grid.grids[0].update({
                pagination: {
                    enabled: true
                }
            });

            cy.get('.hcg-pagination-wrapper').should('exist');
            cy.get('table tbody tr').should('have.length', 21);
        });
    });

    it('Sorted pagination.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                pagination: {
                    pageSize: 5
                }
            });

            // Click on the name column heade to sort
            cy.get('table th[data-column-id="Name"]')
                .eq(0)
                .invoke('click');

            // First row does not contain Michael
            cy.get('table tbody tr')
                .eq(0)
                .should('not.contain', 'Michael');
        });
    });

    it('Lang support.', () => {
        cy.window().its('Grid').then((grid) => {
            // Disable pagination
            grid.grids[0].update({
                lang: {
                    pagination: {
                        pageInfo: 'Total pages {total}',
                        pageSizeLabel: 'Items per page',
                    }
                }
            });

            cy.get('.hcg-pagination-info')
                .eq(0)
                .should('contain', 'Total pages');

            cy.get('.hcg-pagination-page-size-container')
                .eq(0)
                .should('contain', 'Items per page');
        });
    });
});
