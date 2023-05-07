QUnit.test('Hover state tests', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'pictorial'
        },

        plotOptions: {
            pictorial: {
                stacking: 'percent',
                paths: [{
                    definition: 'M50 0 L 100 200 L 0 200 Z'
                }]
            }
        },

        series: [{
            data: [80, 20]
        }, {
            data: [20, 80]
        }]
    });

    const point = chart.series[1].points[0],
        patternId = point.graphic.attr('fill').match(/url\(([^)]+)\)/u)[1],
        controller = new TestController(chart);

    controller.mouseOver(
        point.plotX + chart.plotLeft,
        point.plotY + chart.plotTop + point.shapeArgs.height / 2
    );

    assert.notEqual(
        chart.container
            .querySelector(`${patternId} path`)
            .getAttribute('transform'),
        void 0,
        'Hovered point should have transform'
    );
});
