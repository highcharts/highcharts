QUnit.test('Column series datal abels general tests.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                height: 240,
                width: 160,
                type: 'column'
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 0,
                    animation: false
                }
            },
            series: [
                {
                    data: [0.6, 46.6, 35.5, 59]
                }
            ]
        }),
        dl = chart.series[0].points[0].dataLabel;

    assert.ok(dl.y !== -9999, 'Data label should be visible (#12688).');

    chart.update({
        chart: {
            inverted: true
        }
    });

    dl = chart.series[0].points[0].dataLabel;
    assert.ok(
        dl.y !== -9999,
        'Data label should be visible when chart inverted (#12688).'
    );
});

QUnit.test('Cropping of rotated data labels (#4779)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            min: 10,
            startOnTick: false
        },
        plotOptions: {
            column: {
                animation: false,
                justify: false,
                stacking: 'normal',
                dataLabels: {
                    rotation: 270,
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'John',
                data: [1, 3, 4, 7, 0]
            },
            {
                name: 'Jane',
                data: [1, 2, 0, 20, 1]
            },
            {
                name: 'Joe',
                data: [1, 4, 4, 30, 5]
            }
        ]
    });

    var expected = [
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true
    ];
    chart.series.forEach(function (series) {
        series.points.forEach(function (point) {
            assert.strictEqual(
                point.dataLabel.attr('visibility') === 'hidden',
                expected.shift(),
                'Hidden as expected'
            );
        });
    });
});
