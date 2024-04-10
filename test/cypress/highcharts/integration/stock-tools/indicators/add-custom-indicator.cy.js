
describe('Adding custom indicator on a separate axis through indicator popup, #15804.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/custom-indicator-stock-tools-gui');
    });

    it('#15730: Should close popup after hiding annotation', () => {
        cy.openIndicators()
        cy.get('.highcharts-indicator-list')
            .contains('CUSTOMINDICATORBASEDONRSI')
            .click();
        cy.addIndicator();

        cy.chart().should(chart =>
            assert.strictEqual(
                chart.yAxis.length,
                4,
                `After adding a custom indicator that is based on other oscillators,
                another axis should be added.`
            )
        );
    });
});
