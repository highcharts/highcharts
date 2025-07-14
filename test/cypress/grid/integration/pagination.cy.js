describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/pagination');
    });

    it('Pagination is visible.', () => {
        // Pagination is visible
        cy.get('.hcg-pagination-wrapper').should('be.visible');

        // 2 buttons: first and last
        cy.get('.hcg-pagination-wrapper button').should('have.length', 2);

        // Items per page is 6
        cy.get('table tbody tr').should('have.length', 6);
    });

    it('Events.', () => {
        // Click on the last button
        cy.get('.hcg-pagination-wrapper button').eq(1).click();

        // Check the input values
        cy.get('#beforePageChange').should('have.value', '1');
        cy.get('#afterPageChange').should('have.value', '2');
        
        // Click on the first button
        cy.get('.hcg-pagination-wrapper button').eq(0).click();

        cy.get('#beforePageChange').should('have.value', '2');
        cy.get('#afterPageChange').should('have.value', '1');
    });

    it('Buttons states.', () => {
        // First button is disabled
        cy.get('.hcg-pagination-wrapper button').eq(0)
            .should('be.disabled');

        // Last button is enabled
        cy.get('.hcg-pagination-wrapper button').eq(1)
            .should('not.be.disabled')
            .invoke('click')
            .should('be.disabled');

        // First button is enabled
        cy.get('.hcg-pagination-wrapper button').eq(0)
            .should('not.be.disabled')
            .invoke('click');
    });

    it('Sorted pagination.', () => {
        // Click on the name column heade to sort
        cy.get('table th[data-column-id="Name"]')
            .eq(0)
            .invoke('click');

        // First row does not contain Michael (should be on the second page)
        cy.get('table tbody tr')
            .eq(0)
            .should('not.contain', 'Michael');

        // Click on the next pagination button
        cy.get('.hcg-pagination-wrapper button').eq(1).click();

        cy.get('table tbody tr')
            .eq(0)
            .should('contain', 'Michael');
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
            cy.get('table tbody tr').should('have.length', 10);
        });

        cy.window().its('Grid').then((grid) => {
            // Enable pagination
            grid.grids[0].update({
                pagination: {
                    enabled: true
                }
            });

            cy.get('.hcg-pagination-wrapper').should('exist');
            cy.get('table tbody tr').should('have.length', 6);
        });
    });
});