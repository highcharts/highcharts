QUnit.test('Lollipop offset affection.', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'lollipop'
        },
        series: [{
            data: [{
                low: 2
            }]
        }, {
            type: "errorbar",
            data: [
                [2, 3]
            ]
        }]
    });

    assert.close(
        chart.series[0].data[0].shapeArgs.x,
        chart.series[1].data[0].shapeArgs.x,
        2,
        'Lollipop and Errorbar connectors should be in the same place.'
    );

});