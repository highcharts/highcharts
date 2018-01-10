QUnit.test('Logarithmic axis (#5646)', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'waterfall'
        },
        yAxis: {
            type: 'logarithmic'
        },
        series: [{
            data: [10, 100, 1000],
            threshold: 1
        }]
    });

    [0, 1, 2].forEach(function (i) {
        assert.strictEqual(
            typeof chart.series[0].points[i].graphic.attr('height'),
            'number',
            'Point ' + i + ' height attribute should be a number'
        );
        assert.ok(
            chart.series[0].points[i].graphic.attr('height') < chart.yAxis[0].len,
            'Point ' + i + ' height should be less than yAxis.len'
        );
    });
});
