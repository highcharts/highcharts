describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/datagrid-hidden');
    });

    it('Rows should be visible when datagrid is switched from hidden.', () => {
        // Act
        cy.get('#show').trigger('click');

        // Assert
        cy.get('td').should('have.length', 4);
    });
});
