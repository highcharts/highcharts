describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('data-grid/v2/cell-formatting');
    });

    it('Dates in cells should be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(0).should('have.text', '2022-01-01');
    });

    it('Products in cells should not be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(1).should('have.text', 'Apples');
    });

    it('Weights in cells should be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(2).should('have.text', '100 kg');
    });

    it('Prices in cells should be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(3).should('have.text', '$ 1.50');
    });

    it('Icons in cells should be formatted.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td').eq(4).within(() => {
            cy.get('a').should('have.text', 'Apples URL');
        });
    });

    it('CSS class and style should be applied.', () => {
        cy.get('.highcharts-dg-row').eq(0).find('td.custom-column-class-name')
            .should('have.css', 'color', 'rgb(255, 0, 0)');
    });
});
