QUnit.test('getUnionExtremes', function (assert) {
    var chart = Highcharts.stockChart('container', {

        chart: {
            animation: false,
            width: 600
        },

        rangeSelector: {
            buttons: [{
                type: 'month',
                count: 3,
                text: '3M',
                dataGrouping: {
                    forced: true,
                    units: [
                        ['month', [1]]
                    ]
                }
            }, {
                type: 'month',
                count: 6,
                text: '6M'

            }, {
                type: 'all',
                text: 'All'
            }],
            selected: 3
        },

        series: [{
            data: (function () {
                var arr = [];
                for (var i = 0; i < 1000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            animation: false,
            pointStart: Date.UTC(2009, 0, 1),
            pointInterval: 24 * 36e5
        }]
    });

    assert.strictEqual(
        chart.series[0].currentDataGrouping.unitName,
        'day',
        'Day grouping'
    );

    assert.strictEqual(
        chart.series[0].currentDataGrouping.count,
        1,
        'Day grouping'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        Date.UTC(2009, 0, 1),
        'All'
    );

    assert.strictEqual(
        chart.xAxis[0].max,
        Date.UTC(2011, 8, 27),
        'All'
    );


    chart.rangeSelector.clickButton(0);

    assert.strictEqual(
        chart.series[0].currentDataGrouping.unitName,
        'month',
        'Month grouping'
    );

    assert.strictEqual(
        chart.series[0].currentDataGrouping.count,
        1,
        'Month grouping'
    );

    assert.strictEqual(
        chart.xAxis[0].min,
        Date.UTC(2011, 5, 27),
        'All'
    );

    assert.strictEqual(
        chart.xAxis[0].max,
        Date.UTC(2011, 8, 27),
        'All'
    );
});
