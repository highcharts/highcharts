QUnit.test('Default plot options for stock chart', function (assert) {

    const chart = Highcharts.stockChart('container', {
        series: [{
            data: [1, 2, 3, 4],
            marker: {
                enabled: true
            }
        }],
        navigator: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        2,
        'The default marker radius for stock charts should be respected'
    );

    chart.update({
        plotOptions: {
            line: {
                marker: {
                    radius: 10
                }
            }
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        10,
        'The set plotOptions type marker should be respected'
    );

    chart.series[0].update({
        marker: {
            radius: 5
        }
    });

    assert.strictEqual(
        chart.series[0].options.marker.radius,
        5,
        'The individual series marker should be respected'
    );
});
