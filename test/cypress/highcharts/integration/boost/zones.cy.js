describe('Boost zones with zoneAxis x, #23471', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/issues/boost/23471-zones/');
    });

    it('Point [1, 1] should have red color (zone[1])', () => {
        cy.chart().then(chart => {
            const series = chart.series[0];
            const point1 = series.boost.getPoint({ i: 0 });
            const zone1 = point1.getZone();
            
            assert.strictEqual(zone1?.color || point1.color, 'red');
        });
    });

    it('Point [2, 1] should have default color (no zone)', () => {
        cy.chart().then(chart => {
            const series = chart.series[0];
            const point2 = series.boost.getPoint({ i: 1 });
            const zone2 = point2.getZone();

            assert.strictEqual(zone2.color, undefined);
            assert.strictEqual(zone2.fillColor, undefined);
            assert.strictEqual(point2.color || series.color, series.color);
        });
    });
});

