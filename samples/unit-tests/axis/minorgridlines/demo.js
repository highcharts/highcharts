QUnit.test('Guard too dense minor grid lines', function (assert) {

    assert.expect(0);

    Highcharts.setOptions({
        yAxis: {
            minorTickInterval: "auto" // This is not working
        }
    });

    Highcharts.stockChart('container', {
        yAxis: {
            minorTickInterval: "auto" // This is working
        },
        series: [{
            "data": [
                [1426723200000, 22.999999999999996],
                [1457568000000, 23]
            ]
        }]
    });

    // Reset
    Highcharts.setOptions({
        yAxis: {
            minorTickInterval: null
        }
    });

});
