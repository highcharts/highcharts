describe('Stock Tools Time Cicles, #15826', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
    });

    it(`Should create an annotation and check the shape's coordinates.`, () => {
        cy.selectAnnotation('highcharts-time-cycles', 'highcharts-fibonacci');
        cy.get('.highcharts-container')
            .click(125, 150, { force: true })
            .click(225, 150, { force: true })

        cy.chart().then(chart => {

            const annotation = chart.annotations[0],
                xAxis = chart.xAxis[0],
                point1 = annotation.points[0],
                point2 = annotation.points[1];
            assert.closeTo(
                xAxis.toPixels(point1.x),
                125,
                4,
                'First point should be close to the place, where the mouse clicked.'
            );
            assert.closeTo(
                xAxis.toPixels(point2.x),
                225,
                4,
                'Second point should be close to the place, where the mouse clicked.'
            );
            assert.closeTo(
                annotation.pixelInterval,
                100,
                4,
                'Pixel interval should be equal to the difference between positions.'
            );
        });
    });


    it(`Changes annotation's properties when the controlPoints are dragged.`, () => {
        cy.get('.highcharts-annotation').first()
            .click({ force: true })

        cy.get('.highcharts-control-points')
            .children()
            .last()
            .dragTo('.highcharts-container', 370, 100);
        cy.chart().then(chart => {

            const annotation = chart.annotations[0],
                xAxis = chart.xAxis[0],
                point1 = annotation.points[0],
                point2 = annotation.points[1];

            assert.closeTo(
                xAxis.toPixels(point1.x),
                125,
                4,
                'First point should be close to the place, where it was dragged.'
            );
            assert.closeTo(
                xAxis.toPixels(point2.x),
                370,
                4,
                'Second point should be close to the place, where it was dragged.'
            );
            assert.closeTo(
                annotation.pixelInterval,
                245,
                4,
                'Pixel interval should be adjusted to new value.'
            );
        });
    });

    it(`Dragging control Points should change annotation's properties.`, () => {
        cy.get('.highcharts-annotation').first()
            .dragTo('.highcharts-container', 450, 100, {force: true});

        cy.chart().then(chart => {

            const annotation = chart.annotations[0],
                xAxis = chart.xAxis[0],
                point1 = annotation.points[0],
                point2 = annotation.points[1];
            assert.closeTo(
                xAxis.toPixels(point1.x),
                85,
                4,
                'The point1 should change its place.'
            );
            assert.closeTo(
                xAxis.toPixels(point2.x),
                330,
                4,
                'The point1 should change its place.'
            );
        });
    });
});
