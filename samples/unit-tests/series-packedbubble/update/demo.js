QUnit.test('Series update', function (assert) {
    var series,
        point,
        radius,
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
    point = series.data[5];
    radius = point.marker.radius;
    assert.strictEqual(
        !series.parentNode.graphic,
        false,
        'parentNode is visible after series.update'
    );
    chart.addSeries({
        type: 'pie',
        data: [1],
        size: '5%'
    });
    assert.strictEqual(
        radius,
        point.radius,
        "point's radius is not changing after adding series other than packedbubble."
    );
});