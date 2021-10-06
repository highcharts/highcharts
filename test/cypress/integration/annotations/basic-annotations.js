describe('Basic annotation.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });
    it('Moving circle annotation on the ordinal axis, #16370.', () => {
        cy.selectRange('3m')

        cy.get('.highcharts-label-annotation')
            .children()
            .eq(1)
            .click();
        cy.get('.highcharts-circle-annotation')
            .click();

        cy.get('.highcharts-container')
            .click(550, 200, { force: true })
            .click(450, 200, { force: true })

        cy.get('.highcharts-annotation')
            .first()
            .dragTo('.highcharts-container', 900, 200);
    });
});