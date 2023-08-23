describe('Mouse wheel chart zoom, #19178', () => {

    before(() => {
        cy.visit('/highcharts/cypress/mouse-wheel-zoom');
    });

    it('Should change yAxis extremes and keep axis options after zoom', () => {
        cy.chart().then(chart => {

            const yAxis = chart.yAxis[0],
                { min, max } = yAxis.getExtremes();

            cy.get('#container')
                .trigger("wheel", {
                    deltaY: -66.666666, wheelDelta: 120, wheelDeltaX: 0,
                    wheelDeltaY: 120, bubbles: true
                })
                .then(() => {
                    assert.notEqual(
                        yAxis.min,
                        min,
                        'yAxis min should change after zooming'
                    );

                    assert.notEqual(
                        yAxis.max,
                        max,
                        'yAxis max should change after zooming'
                    );

                    assert.strictEqual(
                        yAxis.options.id,
                        'test',
                        'yAxis id is defined and available after wheel zoom, #19178'
                    );
                });
        });
    });

});