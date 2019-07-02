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

    assert.deepEqual(
        [
            chart.rangeSelector.group.translateX,
            chart.rangeSelector.group.translateY,
            chart.extraTopMargin,
            chart.plotTop
        ],
        [10, 100, undefined, 10],
        'The range selector should be floating'
    );
});
