QUnit.test('Series update', function (assert) {
    var series,
        chart = Highcharts.chart('container', {
            chart: {
                type: 'packedbubble',
                width: 500,
                height: 500,
                marginTop: 46,
                marginBottom: 53
            },
            series: [{
                layoutAlgorithm: {
                    splitSeries: true,
                    parentNodeLimit: true
                },
                data: [50, 80, 50]
            }]
        });
    chart.update({
        series: [{
            data: [2, 3, 4, 5, 6, 7]
        }]
    });
    series = chart.series[0];
    assert.strictEqual(
        !series.parentNode.graphic,
        false,
        'parentNode is visible after series.update'
    );
});