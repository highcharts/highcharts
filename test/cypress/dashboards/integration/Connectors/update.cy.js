describe('Connector update', () => {
    beforeEach(() => {
        cy.visit('/dashboards/cypress/connector-update');
    });

    it('should be able to update the connector data', () => {
        cy.get('#btn').click();
        cy.get('.hcg-table tr[data-row-id="0"] td[data-column-id="Product Name"]').should('have.text', 'Fridge');
    });
});
