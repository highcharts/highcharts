describe('DataGrid and data csvURL.', () => {
    const staticResponse = `X,Y
        0,1
        1,2
        2,3
        3,2
        4,3
        5,1
        6,5
        7,3
        8,1`;

    beforeEach(() => {
        cy.intercept('https://demo-live-data.highcharts.com/updating-set.csv', (req) => {
            req.reply({
                status: 200,
                body: staticResponse
            });
        }).as('request');

        cy.visit('/dashboards/cypress/component-datagrid-csv-url');
    });

    it('Should render the DataGrid when data provided through csvURL.', () => {
        cy.wait('@request');
        cy.get('.highcharts-datagrid-table').should('exist');
    });

    it('Cells should display a loading indicator when loading connectors.', () => {
        cy.get('#dashboard-col-1').should('have.class', 'highcharts-dashboards-cell-state-loading');
        cy.wait('@request');
        cy.get('#dashboard-col-1').should('not.have.class', 'highcharts-dashboards-cell-state-loading');
    });
});
