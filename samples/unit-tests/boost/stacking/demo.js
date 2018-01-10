QUnit.test('Stacked boost series with extremes', function (assert) {

    var chart = Highcharts.chart("container", {
        "xAxis": {
            "min": 0,
            "max": 3
        },
        "yAxis": [{
            "min": 0,
            "max": 10
        }],
        "plotOptions": {
            "series": {
                "boostThreshold": 1,
                "stacking": 'normal'
            }
        },
        "series": [{
            "data": [1, 4, 2, 5]
        }]
    });

    assert.strictEqual(
        chart.container.querySelectorAll('.highcharts-boost-canvas').length,
        1,
        'Chart with boost canvas should be created (#7481)'
    );

});
