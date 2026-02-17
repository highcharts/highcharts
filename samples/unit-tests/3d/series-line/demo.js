QUnit.test('3D line series', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'line',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            }
        },

        title: {
            text: '3D line'
        },

        yAxis: {
            min: 0,
            max: 10
        },

        series: [
            {
                data: [
                    [0, 5],
                    [1, 3],
                    [2, 4]
                ]
            },
            {
                data: [
                    [0, 6],
                    [1, 4],
                    [2, 5]
                ]
            }
        ]
    });

    var path = chart.series[0].graph.attr('d');

    chart.series[0].hide();
    chart.series[0].show();

    assert.strictEqual(
        chart.series[0].graph.attr('d'),
        path,
        'Graph should not change after toggle (#7477)'
    );

    // #20032, SVG error in 3d area
    chart.series[0].update({
        type: 'area'
    });

    assert.strictEqual(
        chart.container.querySelector('svg').innerHTML.indexOf('d="L '),
        -1,
        'The generated SVG should not contain paths starting with line segment'
    );
});

QUnit.test('3D line series with datagrouping (#24042)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'line',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 10,
                viewDistance: 25,
                depth: 40
            }
        },

        title: {
            text: '3D line with datagrouping'
        },

        yAxis: {
            min: 0,
            max: 10
        },

        series: [
            {
                dataGrouping: {
                    enabled: true,
                    groupPixelWidth: 400
                },
                data: [
                    [0, 2],
                    [2, 4],
                    [3, 9],
                    [5, 6],
                    [7, 8],
                    [8, 5],
                    [10, 4]
                ]
            }
        ]
    });

    const series = chart.series[0];

    assert.strictEqual(
        series.data.length,
        0,
        'series.data should be empty when dataGrouping is applied'
    );

    assert.ok(
        typeof series.points[0].plotZ === 'number',
        'plotZ should exist and be a number'
    );
});