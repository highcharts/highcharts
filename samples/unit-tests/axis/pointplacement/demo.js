QUnit.test('Axis pointPlacement', assert => {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [
            {
                data: [1, 4, 3, 5],
                type: 'column',
                pointPlacement: 'on'
            }
        ]
    });

    assert.strictEqual(chart.xAxis[0].toPixels(0, true), 0, 'No padded ticks');

    assert.strictEqual(
        chart.xAxis[0].toPixels(3, true),
        chart.plotWidth,
        'No padded ticks'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [
            {
                data: [1, 4, 3, 5],
                type: 'column',
                pointPlacement: 'between',
                pointPadding: 0,
                groupPadding: 0
            }
        ]
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

QUnit.test('#14637: Line series pointPlacement="between"', assert => {
    const chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },
        series: [
            {
                type: 'column',
                data: [5, 3, 4, 7, 2]
            },
            {
                type: 'line',
                data: [3, 5, 6, 2, 9]
            }
        ]
    });

    assert.strictEqual(
        Math.floor(chart.series[1].points[0].plotX),
        Math.floor(chart.xAxis[0].toPixels(0.5, true)),
        'Points should be placed between ticks'
    );
});
