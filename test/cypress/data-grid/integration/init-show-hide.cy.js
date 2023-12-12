describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/datagrid-hidden');
    });

    it('Rows should be visible when datagrid is switched from hidden.', () => {
        cy.get('#show').trigger('click');
        cy.get('.highcharts-datagrid-row').should('have.length', 4);
    });
});
