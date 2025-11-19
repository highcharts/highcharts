describe('Sparklines update for null-cells.', () => {
    beforeEach(() => {
        cy.visit('/grid-pro/cypress/cell-update-sparkline/');
    });

    it('Highcharts should be built & loaded.', () => {
        cy.window().its('Highcharts').should('exist');
    });

    it('Sparkline should be updated when cell value is set to null.', () => {
        const cellSelector = 'tr[data-row-index="3"] td[data-column-id="Trend"]';
        cy.get('#addRow').click();
        cy.get(cellSelector).dblclick().type('1,2,3{enter}');
        cy.get(`${cellSelector} .highcharts-series-group`).should('exist');
    });
});
