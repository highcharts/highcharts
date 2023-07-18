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

    before(() => {
        cy.intercept('https://demo-live-data.highcharts.com/updating-set.csv', (req) => {
            req.reply({
                status: 200,
                body: staticResponse
            });
        });

        cy.visit('/dashboards/cypress/component-datagrid-csv-url');
    });

    it('Should render the DataGrid when data provided through csvURL.', () => {
        cy.get('.highcharts-datagrid-column-header').should('exist');
    });
});
