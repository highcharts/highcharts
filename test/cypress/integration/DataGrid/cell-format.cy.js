describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/datagrid-cell-formatter');
    });

    it('Dates un cells should be formatted.', () => {
        cy.get('.highcharts-datagrid-cell').eq(0).should('have.text', '2022-01-01');
    });
});
