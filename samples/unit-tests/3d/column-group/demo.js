QUnit.test('3D columns with scatter series', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column',
            animation: false,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 0,
                depth: 300,
                viewDistance: 5
            }
        },
        series: [
            {
                data: [
                    {
                        x: 1,
                        y: 4
                    },
                    {
                        x: 2,
                        y: 9
                    },
                    {
                        x: 3,
                        y: 9
                    }
                ]
            },
            {
                type: 'scatter',
                data: [
                    {
                        x: 1,
                        y: 5
                    },
                    {
                        x: 2,
                        y: 10
                    },
                    {
                        x: 3,
                        y: 10
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.seriesGroup.element.getAttribute('transform'),
        null,
        'seriesGroup is not translated'
    );
});

QUnit.test('3D columns support zero group Z padding', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                depth: 100
            }
        },
        plotOptions: {
            column: {
                depth: 40,
                grouping: false,
                groupZPadding: 0
            }
        },
        series: [{
            data: [1]
        }, {
            data: [2]
        }]
    });

    assert.deepEqual(
        chart.series.map(series => series.points[0].shapeArgs.z),
        [0, 40],
        'Zero padding leaves no space before or between columns'
    );
});
