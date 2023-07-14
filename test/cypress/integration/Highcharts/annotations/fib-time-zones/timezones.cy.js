describe('Stock Tools Fibonacci Time Zones, #15825', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
    });

    it(`Create annotation and check the shape's coordinates.`, () => {
        cy.get('.highcharts-fibonacci').children().eq(1).click();
        cy.get('.highcharts-fibonacci-time-zones').click();

        const firstClickPosition = 200,
            secondClickOffset = 4;

        cy.get('.highcharts-container')
            .click(firstClickPosition, 150, { force: true })
            .click(
                firstClickPosition + secondClickOffset, 150, { force: true }
            );

        cy.chart().then(chart => {
            const annotation = chart.annotations[0];

            assert.strictEqual(
                annotation.shapes.length,
                11,
                '11 lines should be rendered.'
            );

            assert.strictEqual(
                annotation.points[0].x,
                chart.xAxis[0].toValue(firstClickPosition),
                'The first line should be rendered where first mouse click.'
            );

            const firstLinePlotX = annotation.points[0].plotX,
                secondLinePlotX = annotation.points[1].plotX,
                distanceBetweenLines = secondLinePlotX - firstLinePlotX;

            assert.closeTo(
                distanceBetweenLines,
                secondClickOffset,
                0.00001,
                `The second mouse click offset should indicate the distance
                between the first two lines.`
            );

            const fibVal = 34;

            assert.closeTo(
                +annotation.shapes[8].graphic.d.split(' ')[1],
                chart.plotLeft + firstLinePlotX +
                    distanceBetweenLines * fibVal,
                1,
                'The 9th line position should be correct.'
            );
        });
    });

    it('Dragging the whole annotation shape.', () => {
        cy.get('.highcharts-annotation-shapes>path.highcharts-tracker-line')
            .last()
            .click({ force: true })
            .dragTo('.highcharts-container', 100, 150, { force: true });

        cy.chart().then(chart => {
            assert.closeTo(
                chart.annotations[0].points[0].plotX + chart.plotLeft,
                100,
                1.01,
                `The line's position should be updated after dragging.`
            );
        });
    });

    it('Dragging the control point should drag the annotation too.', () => {
        const controlPointNewX = 115;
        let linePos;

        // Get the current line's position.
        cy.chart().then(chart => {
            linePos = +chart.annotations[0].shapes[3].graphic.d.split(' ')[1];
        });

        // Drag the annotation using the control point.
        cy.get('.highcharts-control-points')
            .children()
            .first()
            .dragTo('.highcharts-container', controlPointNewX, 200);

        cy.chart().then(chart => {
            cy.get('.highcharts-popup').should('be.visible');

            assert.notEqual(
                +chart.annotations[0].shapes[3].graphic.d.split(' ')[1],
                linePos,
                'The annotation should change its position.'
            );

            assert.closeTo(
                +chart.annotations[0].shapes[1].graphic.d.split(' ')[1],
                controlPointNewX,
                1,
                `The second line should follow the control point's position.`
            );
        });
    });
});