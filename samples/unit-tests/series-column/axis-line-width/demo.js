QUnit.test('Column with xAxis lineWidth in Highstock (#8031).', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            lineWidth: 17
        },
        series: [{
            data: [400, 124]
        }]
    });

    assert.strictEqual(
        chart.clipBox.height ===
        chart.plotHeight -
        Math.floor(chart.xAxis[0].userOptions.lineWidth / 2),
        true,
        'The column is under xAxis'
    );
});
