describe('Label annotation crop property.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/annotations-gui');
    });

    it('#19179: Should set userOptions.crop based on labelOptions', async () => {
        cy.get('.highcharts-label-annotation:first')
            .click();

        cy.get('#container').click(100, 100);

        cy.chart().should(chart => {
            assert.strictEqual(
                chart.annotations[0].labels[0].options.crop,
                false
            );
        });
    });
});
