describe('Pagination.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/pagination');
    });

    it('Render pagination container.', () => {
        // Check pagination wrapper is visible
        cy.get('.hcg-pagination-wrapper').should('be.visible');

        // Check page info is displayed with correct initial page size
        cy.get('.hcg-pagination-info').should('be.visible');
        cy.get('.hcg-pagination-info').should('contain', 'Showing');

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

    // it('Events.', () => {
    //     // Click on the last button
    //     cy.get('.hcg-pagination-wrapper button').eq(1).click();

    //     // Check the input values
    //     cy.get('#beforePageChange').should('have.value', '1');
    //     cy.get('#afterPageChange').should('have.value', '2');
        
    //     // Click on the first button
    //     cy.get('.hcg-pagination-wrapper button').eq(0).click();

    //     cy.get('#beforePageChange').should('have.value', '2');
    //     cy.get('#afterPageChange').should('have.value', '1');
    // });

    // it('Buttons states.', () => {
    //     // First button is disabled
    //     cy.get('.hcg-pagination-wrapper button').eq(0)
    //         .should('be.disabled');

    //     // Last button is enabled
    //     cy.get('.hcg-pagination-wrapper button').eq(1)
    //         .should('not.be.disabled')
    //         .invoke('click')
    //         .should('be.disabled');

    //     // First button is enabled
    //     cy.get('.hcg-pagination-wrapper button').eq(0)
    //         .should('not.be.disabled')
    //         .invoke('click');
    // });

    // it('Sorted pagination.', () => {
    //     // Click on the name column heade to sort
    //     cy.get('table th[data-column-id="Name"]')
    //         .eq(0)
    //         .invoke('click');

    //     // First row does not contain Michael (should be on the second page)
    //     cy.get('table tbody tr')
    //         .eq(0)
    //         .should('not.contain', 'Michael');

    //     // Click on the next pagination button
    //     cy.get('.hcg-pagination-wrapper button').eq(1).click();

    //     cy.get('table tbody tr')
    //         .eq(0)
    //         .should('contain', 'Michael');
    // });

    // it('Update pagination.', () => {
    //     cy.window().its('Grid').then((grid) => {
    //         // Disable pagination
    //         grid.grids[0].update({
    //             pagination: {
    //                 enabled: false
    //             }
    //         });

    //         cy.get('.hcg-pagination-wrapper').should('not.exist');
    //         cy.get('table tbody tr').should('have.length', 10);
    //     });

    //     cy.window().its('Grid').then((grid) => {
    //         // Enable pagination
    //         grid.grids[0].update({
    //             pagination: {
    //                 enabled: true
    //             }
    //         });

    //         cy.get('.hcg-pagination-wrapper').should('exist');
    //         cy.get('table tbody tr').should('have.length', 6);
    //     });
    // });
});