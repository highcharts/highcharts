QUnit.test('Fixed range for initial range (#5930)', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 600,
            animation: false
        },
        rangeSelector: {
            selected: 1
        },
        series: [{
            name: 'AAPL',
            data: (function () {
                var arr = [];
                for (var i = 0; i < 2000; i++) {
                    arr.push(i);
                }
                return arr;
            }()),
            pointInterval: 24 * 36e5,
            animation: false
        }]
    });

    assert.strictEqual(
        chart.rangeSelector.selected,
        1,
        'Initiallly selected'
    );

    chart.setSize(800);



    assert.strictEqual(
        chart.rangeSelector.selected,
        1,
        'Still selected'
    );
});
