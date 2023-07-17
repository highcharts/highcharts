describe('DataGrid and data csvURL.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/component-datagrid-csvURL');
    });

    it('Should render the DataGrid when data provided through csvURL.', () => {
        cy.intercept('https://demo-live-data.highcharts.com/updating-set.csv').then(() => {
            cy.get('.highcharts-datagrid-column-header').should('exist');
        });
    });
});
