QUnit.test('Area range with compare (#4922)', function (assert) {
    var chart = Highcharts.stockChart('container', {

        chart: {
            type: 'arearange'
        },

        plotOptions: {
            series: {
                compare: 'percent'
            }
        },

        series: [{
            data: [
                [0, 3, 4],
                [1, 4, 6],
                [2, 2, 3]
            ]
        }]
    });

    assert.ok(
        typeof chart.series[0].graph.element.getAttribute('d'),
        'string',
        'We have a graph'
    );
    assert.ok(
        typeof chart.series[0].area.element.getAttribute('d'),
        'string',
        'We have an area'
    );

});