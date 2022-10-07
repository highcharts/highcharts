describe('Measure annotation.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
    });
    it('Measure y annotation should have the width of the chart, #15696', () => {
        cy.selectRange('3m')

        cy.get('.highcharts-measure-xy')
            .children()
            .eq(1)
            .click();
        cy.get('.highcharts-measure-y')
            .click();

        cy.get('.highcharts-container')
            .click(250, 200, { force: true })
            .click(350, 100, { force: true })

        cy.chart().then(chart =>
            assert.ok(
                chart.annotations[0].startXMax,
                'The startXMax property should be calculated.'
            )
        );
    });
});