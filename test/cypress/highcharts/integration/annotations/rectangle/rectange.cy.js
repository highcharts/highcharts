describe('Stock tools rectangle annotatation.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
    });
    it('Rectangle annotation should have closed shape, 16449', () => {
        cy.get('.highcharts-label-annotation').children().eq(1).click();
        cy.get('.highcharts-rectangle-annotation').click();
        cy.get('.highcharts-container')
            .click(250, 200, { force: true })
            .click(350, 100, { force: true });
        let path = cy
            .get('.highcharts-annotation-shapes>path')
            .first()
            .invoke('attr', 'd').then(d => {
                assert.equal(
                    d.slice(-1), // last char of the string
                    'Z',
                    'Shape should be closed'
                );
            });
    });
});