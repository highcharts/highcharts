QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        title: {
            text: 'Volume By Price (VBP)'
        },
        legend: {
            enabled: true
        },
        yAxis: [{
            height: '80%',
            lineWidth: 2
        }, {
            top: '85%',
            height: '15%',
            offset: 0,
            lineWidth: 2
        }],
        series: [{
            type: 'candlestick',
            id: 'main',
            name: 'AAPL',
            params: {
                volumeSeriesID: 'volume'
            },
            data: [
                [0, 37.86, 38.07, 37.56, 37.58],
                [1, 37.60, 37.79, 37.34, 37.63],
                [2, 37.97, 38.33, 37.97, 38.15],
                [3, 38.03, 38.45, 37.93, 38.29],
                [4, 38.31, 38.63, 38.26, 38.60],
                [5, 38.61, 39.52, 38.50, 39.51],
                [6, 39.67, 39.71, 39.10, 39.34],
                [7, 39.44, 40.54, 39.41, 40.46],
                [8, 40.55, 41.05, 40.40, 40.54],
                [9, 40.39, 41.14, 40.34, 41.11],
                [10, 40.90, 41.82, 40.86, 41.27],
                [11, 41.73, 41.93, 41.51, 41.76],
                [12, 42.00, 42.10, 41.57, 41.60],
                [13, 41.68, 41.68, 39.29, 40.98],
                [14, 41.03, 41.40, 40.86, 41.05],
                [15, 41.29, 41.43, 40.18, 40.54],
                [16, 40.88, 40.94, 40.19, 40.36],
                [17, 40.23, 40.41, 39.68, 39.81],
                [18, 40.29, 41.35, 40.26, 41.28],
                [19, 41.37, 41.71, 40.75, 41.31],
                [20, 41.48, 41.50, 40.99, 41.32],
                [21, 41.67, 42.07, 41.43, 42.01],
                [22, 42.11, 42.46, 42.09, 42.19],
                [23, 42.20, 42.79, 41.78, 42.65],
                [24, 42.89, 43.14, 42.83, 42.88],
                [25, 43.10, 43.21, 42.91, 43.19],
                [26, 43.92, 45.00, 43.56, 44.96],
                [27, 45.50, 45.57, 44.90, 45.43],
                [28, 43.34, 44.82, 42.86, 44.21],
                [29, 44.14, 44.89, 43.84, 44.36],
                [30, 44.62, 44.96, 43.83, 44.22]
            ]
        }, {
            type: 'column',
            id: 'volume',
            name: 'Volume',
            yAxis: 1,
            data: [
                109643597,
                96940319,
                97194965,
                102037313,
                107341570,
                163025387,
                158618691,
                164822833,
                167418881,
                146353774,
                196528871,
                162371804,
                120774913,
                258760411,
                117410608,
                168347452,
                112101444,
                108824968,
                125491450,
                167716514,
                102099277,
                164600814,
                106937733,
                139634663,
                157522589,
                108823925,
                230548444,
                276114391,
                308189833,
                180406030,
                137864321
            ]
        }, {
            type: 'vbp',
            linkedTo: 'main',
            name: 'Volume By Price (VBP)',
            showInLegend: true
        }]
    });

    function round(array) {
        return Highcharts.map(array, function (value) {
            return value === null ? null : Number(value.toFixed(2));
        });
    }

    var expectedData = [303778881, 209378883, 321644078, 108824968, 612690610, 1114360905, 447747531, 246572396, 266346514, 0, 626460184, 506662835];

    var base = chart.series[0],
        volume = chart.series[1],
        indicator = chart.series[2];

    assert.deepEqual(
        round(indicator.volumeDataArray),
        expectedData,
        'volumeDataArray is correct after the chart is loaded.'
    );

    base.addPoint([31, 39.25, 39.65, 39.01, 39.55], false);
    volume.addPoint(732500000);

    base.addPoint([32, 39.97, 40.24, 39.88, 40.15], false);
    volume.addPoint(128720000);

    assert.deepEqual(
        round(indicator.volumeDataArray),
        [303778881, 209378883, 321644078, 970044968, 612690610, 1114360905, 447747531, 246572396, 266346514, 0, 626460184, 506662835],
        'volumeDataArray is correct after add two points on the base and the volume series.'
    );

    base.data[base.data.length - 1].remove(false);
    volume.data[volume.data.length - 1].remove();

    assert.deepEqual(
        round(indicator.volumeDataArray),
        [303778881, 209378883, 321644078, 841324968, 612690610, 1114360905, 447747531, 246572396, 266346514, 0, 626460184, 506662835],
        'volumeDataArray is correct after point remove on the base and the volume series.'
    );

    indicator.remove();
    assert.ok(
        Highcharts.inArray(chart.series, indicator) === -1,
        'Indicator is removed after series remove.'
    );
});