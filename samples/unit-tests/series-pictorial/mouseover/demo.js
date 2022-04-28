QUnit.test('Hover state tests', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pictorial'
        },

        plotOptions: {
            pictorial: {
                stacking: 'percent',
                paths: [
                    'M50 0 L 100 200 L 0 200 Z'
                ]
            }
        },

        series: [{
            data: [80, 20],
            name: 'A'
        }, {
            data: [20, 80],
            name: 'B'
        }]
    });

    const point = chart.series[1].points[0];
    const controller = new TestController(chart);
    const x = point.plotX + chart.plotLeft;
    const y =  point.plotY + chart.plotTop + point.shapeArgs.height / 2;
    controller.mouseOver(x, y);
    const patternId = point.graphic.attr('fill').match(/url\(([^)]+)\)/u)[1];

    assert.notEqual(
        chart.container.querySelector(`${patternId} path`).getAttribute('transform'),
        void 0,
        'Hovered point should have transform'
    );
});
