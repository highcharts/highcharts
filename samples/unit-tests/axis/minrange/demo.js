QUnit.test('minRange with log axis', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            type: "logarithmic",
            minRange: 1000
        },
        series: [{
            data: [7937, 9689, 9204, 9087, 12400, 11520, 8781, 11637, 10918, 8198, 10695, 11251]
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].ticks['4'].label.element.textContent,
        '10k',
        'Axis label makes sense'
    );
});
