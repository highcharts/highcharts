describe('Scrolling in huge grid taller than max element height', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/huge-grid');
    });

    it('scroll to bottom should make last row visible', () => {
        cy.get('tbody').scrollTo('bottom');
        cy.get('tr[aria-rowindex="10000001"]').should('be.visible').as('lastRow');

        // Ensure the last row has the expected number of columns rendered
        cy.get('@lastRow').find('td').should('have.length', 5);

        // Check the value in the id column
        cy.get('@lastRow').find('td[data-column-id="ID"]')
            .should('contain', '10000000'); // Expected ID value

        // Check that we can also see the second to last row
        cy.get('tr[aria-rowindex="10000000"]').should('be.visible');
    });

});