QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        title: {
            text: 'Volume Weighted Average Price (VWAP)'
        },
        legend: {
            enabled: true
        },
        yAxis: [{
            height: '60%'
        }, {
            top: '65%',
            height: '35%',
            offset: 0
        }],
        series: [{
            type: 'candlestick',
            id: 'main',
            name: 'AAPL',
            data: [
                [0, 127.00, 127.36, 126.99, 127.28],
                [1, 127.10, 127.31, 127.10, 127.11],
                [2, 127.13, 127.21, 127.11, 127.15],
                [3, 127.00, 127.15, 126.93, 127.04],
                [4, 126.98, 127.08, 126.98, 126.98],
                [5, 127.00, 127.19, 126.99, 127.07],
                [6, 126.97, 127.09, 126.82, 126.93],
                [7, 127.00, 127.08, 126.95, 127.05],
                [8, 127.07, 127.18, 127.05, 127.11],
                [9, 127.10, 127.16, 127.05, 127.15],
                [10, 127.20, 127.31, 127.08, 127.30],
                [11, 127.25, 127.35, 127.20, 127.28],
                [12, 127.26, 127.34, 127.25, 127.28],
                [13, 127.25, 127.29, 127.17, 127.29],
                [14, 127.25, 127.36, 127.25, 127.25],
                [15, 127.21, 127.30, 127.19, 127.22],
                [16, 127.15, 127.24, 127.11, 127.19],
                [17, 127.18, 127.23, 127.17, 127.20],
                [18, 127.10, 127.25, 127.10, 127.10],
                [19, 127.06, 127.13, 127.05, 127.06],
                [20, 127.05, 127.09, 127.04, 127.06],
                [21, 127.05, 127.09, 127.04, 127.07],
                [22, 127.07, 127.09, 127.05, 127.09],
                [23, 127.12, 127.14, 127.07, 127.14],
                [24, 127.10, 127.14, 127.07, 127.13],
                [25, 126.90, 127.12, 126.90, 126.90],
                [26, 126.88, 126.92, 126.87, 126.89],
                [27, 126.84, 126.90, 126.84, 126.84],
                [28, 126.92, 126.94, 126.84, 126.94],
                [29, 126.69, 126.95, 126.69, 126.69]
            ]
        }, {
            type: 'column',
            id: 'volume',
            name: 'Volume',
            yAxis: 1,
            data: [
                89329, 16137, 23945, 20679, 27252, 20915, 17372, 17600, 13896, 6700,
                13848, 9925, 5540, 10803, 19400, 9322, 9982, 8723, 7735, 30330, 8486,
                9885, 10728, 10796, 21740, 43638, 8000, 10340, 10515, 26587
            ]
        }, {
            type: 'vwap',
            linkedTo: 'main',
            name: 'Volume Weighted Average Price (VWAP)',
            showInLegend: true,
            params: {
                period: 30
            }
        }]
    });

    function round(array) {
        return Highcharts.map(array, function (value) {
            return value === null ? null : Number(value.toFixed(4));
        });
    }

    var expectedData = [
        127.2100, 127.2044, 127.1956, 127.1741, 127.1494, 127.1424, 127.1267, 127.1191, 127.1188, 127.1188,
        127.1246, 127.1300, 127.1332, 127.1374, 127.1467, 127.1493, 127.1502, 127.1515, 127.1514, 127.1457,
        127.1439, 127.1420, 127.1403, 127.1397, 127.1384, 127.1235, 127.1198, 127.1145, 127.1102, 127.0938
    ];

    var base = chart.series[0],
        volume = chart.series[1],
        indicator = chart.series[2];

    assert.deepEqual(
        round(indicator.yData),
        expectedData,
        'yData is correct after the chart is loaded.'
    );

    base.addPoint([30, 126.70, 126.78, 126.67, 126.74], false);
    volume.addPoint(11731);

    assert.deepEqual(
        round(indicator.yData),
        expectedData.concat(126.7300),
        'yData is correct after add point on the base and the volume series.'
    );

    base.data[base.data.length - 1].update({ high: 127 }, false);
    volume.data[volume.data.length - 1].update({ y: 10000 });

    assert.deepEqual(
        round(indicator.yData),
        expectedData.concat(126.8033),
        'yData is correct after update point on the base and the volume series.'
    );

    indicator.update({
        params: {
            period: 31
        }
    });

    assert.deepEqual(
        round(indicator.yData),
        expectedData.concat(127.0885),
        'yData is correct after indicator update (period).'
    );

    base.data[base.data.length - 1].remove(false);
    volume.data[volume.data.length - 1].remove();

    assert.deepEqual(
        round(indicator.yData),
        [
            127.2100, 127.2044, 127.1956, 127.1741, 127.1494, 127.1424, 127.1267, 127.1191, 127.1188, 127.1188,
            127.1246, 127.1300, 127.1332, 127.1374, 127.1467, 127.1493, 127.1502, 127.1515, 127.1514, 127.1457,
            127.1439, 127.1420, 127.1403, 127.1397, 127.1384, 127.1235, 127.1198, 127.1145, 127.1102, 127.0938
        ],
        'yData is correct after point remove on the base and the volume series.'
    );

    indicator.remove();
    assert.ok(
        Highcharts.inArray(chart.series, indicator) === -1,
        'Indicator is removed after series remove.'
    );
});