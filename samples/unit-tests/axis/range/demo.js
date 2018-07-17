
QUnit.test('#6773 - cannot update xAxis range dynamically', function (assert) {
    var chart = Highcharts.stockChart('container', {
        xAxis: {
            range: 5
        },
        series: [{
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }]
    });

    chart.xAxis[0].update({
        range: 10
    });

    assert.strictEqual(
        chart.xAxis[0].min,
        9,
        'range updated'
    );
});