
QUnit.test('Test PSAR calculations on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
        series: [{
            id: 'main',
            type: 'candlestick',
            data: [
                [0, 5, 6, 3, 4],
                [1, 5, 6, 3, 4],
                [2, 5, 6, 3, 4],
                [3, 5, 6, 3, 4]
            ]
        }, {
            type: 'psar',
            linkedTo: 'main',
            params: {
                index: 2,
                decimals: 6
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.index,
        'Initial number of PSAR points is correct'
    );

    chart.series[0].addPoint([4, 17, 18, 10, 17]);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.index,
        'After addPoint number of PSAR points is correct'
    );

    chart.series[0].setData([
        [Date.UTC(1983, 8, 13), 10.3000, 10.3300, 10.1100, 10.1600],
        [Date.UTC(1983, 8, 14), 9.9500, 9.9800, 9.7600, 9.8000],
        [Date.UTC(1983, 8, 15), 9.7500, 9.8300, 9.6400, 9.7600],
        [Date.UTC(1983, 8, 16), 9.5500, 9.6000, 9.3500, 9.4100],
        [Date.UTC(1983, 8, 19), 9.5500, 9.8500, 9.5100, 9.8500],
        [Date.UTC(1983, 8, 20), 9.7700, 9.8000, 9.2500, 9.3300],
        [Date.UTC(1983, 8, 21), 9.0900, 9.1900, 9.0000, 9.0600],
        [Date.UTC(1983, 8, 22), 9.1600, 9.4100, 9.1600, 9.4000],
        [Date.UTC(1983, 8, 23), 9.4000, 9.4700, 9.0800, 9.2200],
        [Date.UTC(1983, 8, 26), 8.9500, 9.3200, 8.9500, 9.3100],
        [Date.UTC(1983, 8, 27), 9.6400, 9.9400, 9.5500, 9.7600],
        [Date.UTC(1983, 8, 28), 9.8300, 10.2300, 9.8300, 10.0000],
        [Date.UTC(1983, 8, 29), 10.0000, 10.1100, 9.5600, 9.5900],
        [Date.UTC(1983, 8, 30), 9.4600, 10.5000, 9.4600, 10.4000],
        [Date.UTC(1983, 9, 3), 10.8800, 11.2500, 10.8200, 11.2300],
        [Date.UTC(1983, 9, 4), 11.3000, 11.5700, 11.3000, 11.4400],
        [Date.UTC(1983, 9, 5), 11.4900, 11.5500, 11.2100, 11.4400],
        [Date.UTC(1983, 9, 6), 11.4200, 11.8000, 11.2900, 11.7800],
        [Date.UTC(1983, 9, 7), 11.7800, 11.9000, 11.6700, 11.8800],
        [Date.UTC(1983, 9, 10), 11.8500, 11.9400, 11.6200, 11.6700],
        [Date.UTC(1983, 9, 11), 11.5000, 11.5900, 11.3200, 11.3300],
        [Date.UTC(1983, 9, 12), 11.2200, 11.4300, 11.0500, 11.0500],
        [Date.UTC(1983, 9, 13), 10.9500, 11.2300, 10.8700, 11.0900],
        [Date.UTC(1983, 9, 14), 11.2200, 11.3700, 11.1100, 11.3500],
        [Date.UTC(1983, 9, 17), 11.2000, 11.3400, 11.1200, 11.2700],
        [Date.UTC(1983, 9, 18), 11.0800, 11.2700, 10.9600, 11.0000],
        [Date.UTC(1983, 9, 19), 10.8600, 10.9400, 10.7500, 10.7600],
        [Date.UTC(1983, 9, 20), 10.6800, 10.7600, 10.5300, 10.5400],
        [Date.UTC(1983, 9, 21), 10.6200, 10.6900, 10.5500, 10.6800],
        [Date.UTC(1983, 9, 24), 10.6600, 10.7800, 10.0500, 10.0900],
        [Date.UTC(1983, 9, 25), 9.9500, 10.0200, 9.7700, 9.8900],
        [Date.UTC(1983, 9, 26), 9.9500, 10.0600, 9.8200, 10.0400],
        [Date.UTC(1983, 9, 27), 9.7500, 9.8000, 9.4800, 9.6300],
        [Date.UTC(1983, 9, 28), 9.6800, 9.7500, 9.6400, 9.6600],
        [Date.UTC(1983, 9, 31), 9.4200, 9.5000, 9.3300, 9.3600],
        [Date.UTC(1983, 10, 1), 9.2800, 9.3900, 9.1300, 9.3700],
        [Date.UTC(1983, 10, 2), 9.4000, 9.5400, 9.0600, 9.1000],
        [Date.UTC(1983, 10, 3), 8.9700, 9.4500, 8.9700, 9.4300],
        [Date.UTC(1983, 10, 4), 9.3700, 9.6500, 9.2700, 9.5200],
        [Date.UTC(1983, 10, 7), 9.7800, 9.9600, 9.7600, 9.8100],
        [Date.UTC(1983, 10, 8), 9.9600, 10.0200, 9.8700, 9.9100],
        [Date.UTC(1983, 10, 9), 9.6500, 9.8200, 9.6200, 9.7600],
        [Date.UTC(1983, 10, 10), 9.6600, 10.0800, 9.6600, 9.9600],
        [Date.UTC(1983, 10, 11), 9.9800, 10.0400, 9.2500, 9.2600],
        [Date.UTC(1983, 10, 14), 9.1300, 9.4000, 9.1300, 9.4000],
        [Date.UTC(1983, 10, 15), 9.3000, 9.4700, 9.2000, 9.2200],
        [Date.UTC(1983, 10, 16), 9.1900, 9.3400, 9.1200, 9.2000],
        [Date.UTC(1983, 10, 17), 9.0500, 9.4000, 8.8200, 9.3700],
        [Date.UTC(1983, 10, 18), 9.3200, 9.4500, 9.2800, 9.3500],
        [Date.UTC(1983, 10, 21), 9.2700, 10.1000, 9.2700, 10.0800]
    ], false);

    chart.series[1].update({
        color: 'red',
        params: {
            index: 4,
            decimals: 3
        }
    });

    assert.deepEqual(
        chart.series[1].yData,
        [
            9.350,
            9.350,
            10.330,
            10.277,
            10.226,
            10.177,
            10.103,
            10.034,
            8.950,
            8.996,
            9.087,
            9.260,
            9.491,
            9.699,
            9.951,
            10.224,
            10.498,
            10.729,
            10.923,
            11.940,
            11.907,
            11.875,
            11.820,
            11.734,
            11.614,
            11.506,
            11.331,
            11.112,
            10.924,
            10.693,
            10.499,
            10.289,
            10.057,
            9.858,
            9.680,
            9.650,
            8.970,
            9.012,
            9.052,
            9.114,
            9.172,
            10.080,
            10.045,
            9.989,
            9.896,
            9.810
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Marker color changed'
    );
    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [
            9.350,
            9.350,
            10.330,
            10.277,
            10.226,
            10.177,
            10.103,
            10.034,
            8.950,
            8.996,
            9.087,
            9.260,
            9.491,
            9.699,
            9.951,
            10.224,
            10.498,
            10.729,
            10.923,
            11.940,
            11.907,
            11.875,
            11.820,
            11.734,
            11.614,
            11.506,
            11.331,
            11.112,
            10.924,
            10.693,
            10.499,
            10.289,
            10.057,
            9.858,
            9.680,
            9.650,
            8.970,
            9.012,
            9.052,
            9.114,
            9.172,
            10.080,
            10.045,
            9.989,
            9.896
        ],
        'Correct values after point.remove()'
    );

    Highcharts.seriesTypes.psar.prototype.getValues(
        {
            xData: [0, 1, 2, 3, 4, 5],
            yData: [
                [10, 15, 5, 10],
                [10, 15, 5, 10],
                [10, 15, 5, 10],
                [null, null, null, null],
                [null, null, null, null],
                [null, null, null, null],
                [10, 15, 5, 10],
                [10, 15, 5, 10]
            ]
        },
        Highcharts.getOptions().plotOptions.psar.params
    );
    assert.ok(true, 'No errors when data contains multiple null points.');

    Highcharts.seriesTypes.psar.prototype.getValues(
        {
            xData: [0],
            yData: [1]
        },
        Highcharts.getOptions().plotOptions.psar.params
    );

    assert.ok(
        true,
        'No error when index is greater than data length (#8376).'
    );
});
