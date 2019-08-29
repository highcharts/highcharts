QUnit.test('Axis pointPlacement', assert => {

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [{
            data: [1, 4, 3, 5],
            type: 'column',
            pointPlacement: 'on'
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].toPixels(0, true),
        0,
        'No padded ticks'
    );

    assert.strictEqual(
        chart.xAxis[0].toPixels(3, true),
        chart.plotWidth,
        'No padded ticks'
    );

});
