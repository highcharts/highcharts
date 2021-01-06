QUnit.test('RangeSelector enabled', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400
        },
        rangeSelector: {
            enabled: false
        },

        series: [
            {
                data: [1, 2, 10, 10]
            }
        ]
    });

    const plotTop = chart.plotTop;

    chart.update({
        rangeSelector: {
            enabled: true
        }
    });

    assert.ok(chart.rangeSelector, 'chart.rangeSelector should be set');

    // #11669
    assert.ok(
        chart.plotTop > plotTop,
        'plotTop should have increased to make room for range selector'
    );
    assert.ok(
        chart.rangeSelector.minDateBox.text.textStr,
        'dateBox text should be set'
    );
});
