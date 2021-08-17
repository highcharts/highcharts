describe('Stock tools Ellipse Annotation, #15008', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Should create Ellipse annotation via stock tools and test its params', () => {
        cy.get('.highcharts-label-annotation').children().eq(1).click();
        cy.get('.highcharts-ellipse-annotation').click();

        cy.get('.highcharts-container')
            .click(300, 150, { force: true })
            .click(350, 100, { force: true })
            .click(300, 170, { force: true });

        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x = xAxis.toPixels(ellipse.points[0].x),
                y = yAxis.toPixels(ellipse.points[0].y);
            assert.closeTo(
                ellipse.options.rx,
                70,
                1,
                'Calculated rx should be close to expected value.'
            );
            assert.strictEqual(
                ellipse.options.ry,
                20,
                'Calculated ry should be equal to expected value.'
            );
            assert.closeTo(
                ellipse.angle,
                -45,
                1,
                'Angle should be equal to given number.'
            );
            assert.closeTo(
                x,
                300,
                1,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
            assert.closeTo(
                y,
                150,
                1,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
        });
    });

    it('Should drag the ellipse annotation and update its params', () => {
        cy.get('.highcharts-annotation')
            .first()
            .click()
            .dragTo('.highcharts-container', 350, 100);
        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x = xAxis.toPixels(ellipse.points[0].x),
                y = yAxis.toPixels(ellipse.points[0].y);
            assert.closeTo(
                x,
                350,
                5,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
            assert.closeTo(
                y,
                100,
                5,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
        });
    });

    it('Should change the rx, ry and angle when dragging control Points.', () => {
        cy.get('.highcharts-control-points')
            .children()
            .last()
            .dragTo('.highcharts-container', 250, 100);

        cy.get('.highcharts-control-points')
            .children()
            .first()
            .dragTo('.highcharts-container', 350, 150);

        cy.get('.highcharts-popup').should('be.visible');

        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x = xAxis.toPixels(ellipse.points[0].x),
                y = yAxis.toPixels(ellipse.points[0].y);
            assert.closeTo(
                ellipse.options.rx,
                100,
                5,
                'Calculated rx should be close to expected value.'
            );
            assert.closeTo(
                ellipse.options.ry,
                50,
                5,
                'Calculated ry should be equal to expected value.'
            );
            assert.closeTo(
                ellipse.angle,
                0,
                5,
                'Angle should be equal to given number.'
            );
        });
    });
});
