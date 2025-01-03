describe('Chart tick trimming, #21743', () => {

    before(() => {
        cy.visit('/highcharts/cypress/axis-tick');
    });

    it('Should properly filter ticks on any linked same sized non-grid axis', () => {
        cy.chart().then(chart => {
            chart.setSize(600, null);

            const pAxis = chart.xAxis[0],
                lAxis = chart.xAxis[1],
                parentAxisTicks = pAxis.gridGroup.element
                    .querySelectorAll('.highcharts-minor-grid-line'),
                linkedAxisTicks = lAxis.gridGroup.element
                    .querySelectorAll('.highcharts-minor-grid-line');

            assert.strictEqual(
                linkedAxisTicks.length,
                parentAxisTicks.length,
                'Linked axis should have same nr of minor ticks as parent on' +
                'same sized non-grid axis.'
            );

            for (let i = 0; i < parentAxisTicks.length; i++) {
                const pVis = parentAxisTicks[i].getAttribute('visibility'),
                    lVis = linkedAxisTicks[i].getAttribute('visibility');

                assert.strictEqual(
                    lVis,
                    pVis,
                    `Tick ${i} should have same visibility as it's parent.`
                );
            }
        });
    });

});