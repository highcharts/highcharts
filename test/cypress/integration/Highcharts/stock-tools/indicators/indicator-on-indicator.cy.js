describe('An indicator on indicator, #15696.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
    });

    it('There should be a possibility to add indicators based on other indicator, #15696.', () => {
        cy.openIndicators();
        cy.selectIndicator('SMA')
        cy.addIndicator(); // Add SMA indicator.

        cy.openIndicators();
        cy.selectIndicator('SMA')
        cy.get('#highcharts-select-series')
            .contains('SMA (14)')

        cy.get('#highcharts-select-series')
            .select('SMA (14)')

        cy.get('input[name="highcharts-sma-period"]')
            .eq(0)
            .clear()
            .type('20');

        cy.addIndicator(); // Add SMA indicator with period 20.

        cy.chart().should(chart =>
            assert.strictEqual(
                chart.series[2].xData.length - chart.series[3].xData.length,
                19,
                `The second SMA indicator which is based on the previous SMA indicator
                should be shifted by period (19) thus data should have 19 fewer points.`
            )
        );

        cy.openIndicators();

        cy.get('#highcharts-select-series')
            .contains('SMA (20)')

        cy.get('.highcharts-tab-item')
            .eq(1)
            .click(); // Open EDIT bookmark.

        cy.get('#highcharts-select-series')
            .contains('SMA (20)')
            .should('not.contain', 'SMA (14)')
    });
});