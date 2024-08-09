describe('Mouse wheel chart zoom, #19178', () => {

    before(() => {
        cy.visit('/highcharts/cypress/drilldown');
    });

    it('#21534, Should drill down even if point mouseOver is defined', () => {
        cy.chart().then(chart => {
            cy.get('#container')
                .click(chart.plotLeft + (chart.plotWidth / 2) - 50, chart.plotTop + (chart.plotHeight / 2) + 100)
                .then(() => {
                    const points = chart.series[0].points;
                    assert.isTrue(
                        points[0].name === 'd' && points[0].y === 4,
                        'Points should change after drilldown'
                    );
                });
        });
    });

});