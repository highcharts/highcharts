
QUnit.test('Navigator series\' should keep it\'s position in series array, even after series.update()', function (assert) {
    var chart = Highcharts.stockChart('container', {
            series: [{
                data: [1, 2, 3],
                id: '1'
            }, {
                data: [1, 2, 3],
                id: '2'
            }, {
                data: [1, 2, 3],
                id: '3'
            }]
        }),
        initialIndexes = chart.series.map(function (s) {
            return s.options.id;
        }),
        afterUpdateIndexes;


    Highcharts.each(chart.series, function (s, i) {
        s.update({
            name: 'Name ' + i
        }, false);
    });
    chart.redraw();

    afterUpdateIndexes = chart.series.map(function (s) {
        return s.options.id;
    });

    assert.deepEqual(
        initialIndexes,
        afterUpdateIndexes,
        'Correct zIndexes after update'
    );
});


QUnit.test(
    'Updating types, new type lost after second update (#2322)',
    function (assert) {
        var data = [
            [0, 1, 2, 3, 4]
        ];

        var chart = Highcharts.chart('container', {
            series: [{
                type: 'candlestick',
                data: [
                    [0, 4.11, 4.12, 4.50, 4.07]
                ],
            }]
        });

        assert.strictEqual(
            chart.series[0].pointArrayMap.toString(),
            'open,high,low,close',
            'OHLC point array map'
        );

        // Update type and data at the same time
        chart.series[0].update({
            data: data,
            type: 'line'
        }, true);

        assert.strictEqual(
            chart.series[0].pointArrayMap,
            undefined,
            'No point array map on base Series'
        );

        // Repeat: Update type and data at the same time
        chart.series[0].update({
            data: data,
            type: 'line'
        }, true);

        assert.strictEqual(
            chart.series[0].pointArrayMap,
            undefined,
            'No point array map on base Series'
        );

    }
);