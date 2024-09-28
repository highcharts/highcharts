describe('Name of the group', () => {

    /*
     *   beforeEach and afterEach should be used with care.
     *   Avoid heavy operations such as `cy.visit()`
     */
    beforeEach(() => {
        // reset before tests
        cy.viewport(1000, 500);
    });

    /* afterEach(()=>{
        //
    }); */

    // Set up before tests
    before(() => {
        cy.visit('/highcharts/3d/area');
    });

    it('There should be a chart', () => {
        cy.window().then((win) => {
            const { Highcharts: hc } = win;

            // We can still do assertions like this
            assert.isAtLeast(hc.charts.length, 1);
        });
    });

    it('clicking a legend item should hide it and the series ', () => {
        cy.get('.highcharts-legend-item')
            .as('legend-item')
            .click()
            .should('have.class', 'highcharts-legend-item-hidden');

        cy.get('.highcharts-series')
            .first()
            .as('series')
            .then((el) => {
                assert.strictEqual(el.attr('visibility'), 'hidden');
            });

        cy.get('@legend-item').click();
        cy.get('@series').then((el) => {
            assert.strictEqual(el.attr('visibility'), undefined);
        });
    });
});