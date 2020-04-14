QUnit.test('#12391 series.update and zones', function (assert) {
    var chart = Highcharts.stockChart('container', {
        xAxis: {
            min: 3,
            max: 4
        },
        series: [{
            data: [1, 2, 3, 2, 4],
            zoneAxis: 'x',
            zones: [{
                value: 4
            }]
        }, {
            data: [3, 4],
            zoneAxis: 'x',
            zones: [{
                value: 4
            }]
        }]
    });

    const series = chart.series[1];

    chart.xAxis[0].setExtremes(0, 1);
    chart.xAxis[0].setExtremes(3, 4);

    series.hide();
    series.update();

    series.show();
    series.update();

    assert.ok(
        true,
        'Update should not return zone clip error.'
    );
});