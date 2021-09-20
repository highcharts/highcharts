describe('Stock tools Ellipse Annotation, #15008', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Should create Ellipse annotation via stock tools and test its params.', () => {
        cy.get('.highcharts-label-annotation').children().eq(1).click();
        cy.get('.highcharts-ellipse-annotation').click();

        cy.get('.highcharts-container')
            .click(250, 200, { force: true })
            .click(350, 100, { force: true })
            .click(300, 170, { force: true });

        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x1 = xAxis.toPixels(ellipse.points[0].x),
                y1 = yAxis.toPixels(ellipse.points[0].y),
                x2 = xAxis.toPixels(ellipse.points[1].x),
                y2 = yAxis.toPixels(ellipse.points[1].y);

           
          
            assert.closeTo(
                x1,
                250,
                1,
                `First point's x value should be close to the place, where it was clicked.`
            );
            assert.closeTo(
                y1,
                200,
                1,
                `First point's y value should be close to the place, where it was clicked.`
            );
            assert.closeTo(
                x2,
                350,
                1,
                `Second point's x value should be close to the place, where it was clicked.`
            );
            assert.closeTo(
                y2,
                100,
                1,
                `Second point's y value should be close to the place, where it was clicked.`
            );

            assert.closeTo(
                ellipse.options.ry,
                20,
                1,
                'Calculated ry should be close to expected value.'
            );
        });
    });

    it('Should drag the ellipse annotation and update its params.', () => {
        cy.get('.highcharts-annotation')
            .first()
            .click()
            .dragTo('.highcharts-container', 300, 100);
        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x = xAxis.toPixels(ellipse.points[0].x),
                y = yAxis.toPixels(ellipse.points[0].y),
                x2 = xAxis.toPixels(ellipse.points[1].x),
                y2 = yAxis.toPixels(ellipse.points[1].y);

            assert.closeTo(
                (x + x2) / 2,
                300,
                5,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
            assert.closeTo(
                (y + y2) / 2,
                100,
                5,
                'Center of the ellipse should be close to the place, where it was clicked.'
            );
        });
    });

    it('Should change points positions when dragging control points.', () => {
        cy.get('.highcharts-control-points')
            .children()
            .first()
            .dragTo('.highcharts-container', 250, 100);
        cy.get('.highcharts-control-points')
            .children()
            .eq(1)
            .dragTo('.highcharts-container', 450, 150);
        cy.get('.highcharts-control-points')
            .children()
            .last()
            .dragTo('.highcharts-container', 350, 150);

        cy.get('.highcharts-popup').should('be.visible');

        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0],
                xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                x = xAxis.toPixels(ellipse.points[0].x),
                y = yAxis.toPixels(ellipse.points[0].y),
                x2 = xAxis.toPixels(ellipse.points[1].x),
                y2 = yAxis.toPixels(ellipse.points[1].y);
            assert.closeTo(
                x,
                250,
                1,
                'New position of the first point should be equal to expected value.'
            );
            assert.closeTo(
                y,
                100,
                1,
                'New position of the first point should be equal to expected value.'
            );
            assert.closeTo(
                x2,
                450,
                1,
                'New position of the second point should be equal to expected value.'
            );
            assert.closeTo(
                y2,
                150,
                1,
                'New position of the second point should be equal to expected value.'
            );
            assert.closeTo(
                ellipse.options.ry,
                26,
                1,
                'New ry property value should be equal to expected value.'
            );
           
        });
    });

    it('Ellipse should keep its shape after popup edit.', () => {
        cy.contains('edit').click();
        cy.contains('save').click();
        cy.chart().then(chart => {
            const ellipse = chart.annotations[0].shapes[0];
           
            assert.closeTo(
                ellipse.options.ry,
                26,
                1,
                `Ry property shouldn't change after popup edit.`
            );
        });
    })

    it('Ellipse should adjust its values when extremes change.', () => {

            cy.chart().then(chart => {
                chart.xAxis[0].setExtremes(Date.UTC(2020), Date.UTC(2021));
                const ellipse = chart.annotations[0].shapes[0],
                    xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
                    yAxis = chart.yAxis[ellipse.points[0].options.yAxis],
                    x = xAxis.toPixels(ellipse.points[0].x),
                    y = yAxis.toPixels(ellipse.points[0].y),
                    x2 = xAxis.toPixels(ellipse.points[1].x),
                    y2 = yAxis.toPixels(ellipse.points[1].y);
                assert.closeTo(
                    x,
                    180,
                    1,
                    'New position of the first point should be equal to expected value.'
                );
                assert.closeTo(
                    y,
                    58,
                    1,
                    'New position of the first point should be equal to expected value.'
                );
                assert.closeTo(
                    x2,
                    593,
                    1,
                    'New position of the second point should be equal to expected value.'
                );
                assert.closeTo(
                    y2,
                    138,
                    1,
                    'New position of the second point should be equal to expected value.'
                ); 

                assert.closeTo(
                    ellipse.options.ry,
                    26,
                    1,
                    `RY property should adjust to current extremes.`
                );
            });
        })

});
