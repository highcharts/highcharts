describe('DataGrid and data csvURL.', () => {
    const staticResponse = `X,Y
        0,9.355234852158896
        1,8.574385592083518
        2,2.8410607402536514
        3,5.639178768735647
        4,3.370220133233466
        5,1.0763357467342671
        6,1.794012040624473
        7,2.831284394994975
        8,0.3728454379130297`;

    before(() => {
        cy.intercept('https://demo-live-data.highcharts.com/updating-set.csv', (req) => {
            req.reply({
                status: 200,
                body: staticResponse
            });
        });

        cy.visit('/dashboards/cypress/component-datagrid-csvurl');
    });

    it('Should render the DataGrid when data provided through csvURL.', () => {
        cy.get('.highcharts-datagrid-column-header').should('exist');
    });
});
