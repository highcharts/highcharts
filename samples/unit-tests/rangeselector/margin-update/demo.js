QUnit.test('Margin left update.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL',
            data: [1, 2, 3]
        }]
    });

    chart.update({
        chart: {
            marginLeft: 50
        }
    });

    assert.strictEqual(
        chart.plotLeft,
        50,
        'Left margin updated.'
    );
});

