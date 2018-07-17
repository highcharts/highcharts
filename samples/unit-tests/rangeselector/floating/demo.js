QUnit.test('Floating enabled.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        rangeSelector: {
            floating: true,
            x: 10,
            y: 100
        },

        series: [{
            data: [1, 2, 10, 10]
        }]
    });

    assert.strictEqual(
        (chart.rangeSelector.group.translateX === 10) &&
        (chart.rangeSelector.group.translateY === 100) &&
        (chart.extraTopMargin === undefined) &&
        (chart.plotTop === 10),
        true,
        'floating'
    );
});

