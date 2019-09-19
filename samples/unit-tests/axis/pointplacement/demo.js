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

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [{
            data: [1, 4, 3, 5],
            type: 'column',
            pointPlacement: 'between',
            pointPadding: 0,
            groupPadding: 0
        }]
    });

    var isInsidePlot = true;

    chart.series[0].points.forEach(p => {
        if (isInsidePlot) {
            isInsidePlot = chart.isInsidePlot(p.plotX, p.plotY, true);
        }
    });

    assert.ok(
        isInsidePlot,
        'All points are between appropriate ticks when the chart is inverted.'
    );
});
