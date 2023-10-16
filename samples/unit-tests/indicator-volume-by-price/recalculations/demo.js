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
        yAxis: [
            {
                height: '80%',
                lineWidth: 2
            },
            {
                top: '85%',
                height: '15%',
                offset: 0,
                lineWidth: 2
            }
        ],
        series: [
            {
                type: 'candlestick',
                id: 'main',
                name: 'AAPL',
                data: [
                    [0, 37.86, 38.07, 37.56, 37.58],
                    [1, 37.6, 37.79, 37.34, 37.63],
                    [2, 37.97, 38.33, 37.97, 38.15],
                    [3, 38.03, 38.45, 37.93, 38.29],
                    [4, 38.31, 38.63, 38.26, 38.6],
                    [5, 38.61, 39.52, 38.5, 39.51],
                    [6, 39.67, 39.71, 39.1, 39.34],
                    [7, 39.44, 40.54, 39.41, 40.46],
                    [8, 40.55, 41.05, 40.4, 40.54],
                    [9, 40.39, 41.14, 40.34, 41.11],
                    [10, 40.9, 41.82, 40.86, 41.27],
                    [11, 41.73, 41.93, 41.51, 41.76],
                    [12, 42.0, 42.1, 41.57, 41.6],
                    [13, 41.68, 41.68, 39.29, 40.98],
                    [14, 41.03, 41.4, 40.86, 41.05],
                    [15, 41.29, 41.43, 40.18, 40.54],
                    [16, 40.88, 40.94, 40.19, 40.36],
                    [17, 40.23, 40.41, 39.68, 39.81],
                    [18, 40.29, 41.35, 40.26, 41.28],
                    [19, 41.37, 41.71, 40.75, 41.31],
                    [20, 41.48, 41.5, 40.99, 41.32],
                    [21, 41.67, 42.07, 41.43, 42.01],
                    [22, 42.11, 42.46, 42.09, 42.19],
                    [23, 42.2, 42.79, 41.78, 42.65],
                    [24, 42.89, 43.14, 42.83, 42.88],
                    [25, 43.1, 43.21, 42.91, 43.19],
                    [26, 43.92, 45.0, 43.56, 44.96],
                    [27, 45.5, 45.57, 44.9, 45.43],
                    [28, 43.34, 44.82, 42.86, 44.21],
                    [29, 44.14, 44.89, 43.84, 44.36],
                    [30, 44.62, 44.96, 43.83, 44.22]
                ]
            },
            {
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
            },
            {
                type: 'vbp',
                linkedTo: 'main',
                name: 'Volume By Price (VBP)',
                showInLegend: true
            }
        ]
    });

    // Testing VBP indicator when `compare` mode is on the main series, #16277

    const VBPIndicator = chart.series[2],
        correctFloat = Highcharts.correctFloat,
        ranges = VBPIndicator.options.params.ranges,
        lowRange = 37.58,
        highRange = 45.43,
        rangeStep = correctFloat(highRange - lowRange) / ranges;

    assert.strictEqual(
        VBPIndicator.rangeStep,
        rangeStep,
        'The basic rangeStep should be correct based on the above data, #16277.'
    );

    chart.series[0].setCompare('percent');

    const compareLowRange =
            VBPIndicator.linkedParent.dataModify.modifyValue(lowRange),
        compareHighRange =
            VBPIndicator.linkedParent.dataModify.modifyValue(highRange),
        compareRangeStep =
            correctFloat(compareHighRange - compareLowRange) / ranges;

    assert.strictEqual(
        VBPIndicator.rangeStep,
        compareRangeStep,
        `The rangeStep should be updated and correct based on the above data
        in the compare mode, #16277.`
    );

    // Change the above 3 lines to only 1 line: "chart.series[0].setCompare();"
    // after the #16397 is fixed
    chart.series[0].setCompare(null, false);
    VBPIndicator.recalculateValues();
    chart.redraw();

    assert.strictEqual(
        VBPIndicator.rangeStep,
        rangeStep,
        `The basic rangeStep should be correct based on the above data after
        disabling the compare mode, #16277.`
    );

    // End of #16277 testing, start other tests

    VBPIndicator.update({
        params: {
            ranges: 6
        }
    });

    assert.strictEqual(
        VBPIndicator.volumeDataArray.length,
        6,
        'VBP params should be updated after update(), #17007.'
    );

    VBPIndicator.update({
        params: {
            ranges: 12
        }
    });

    function round(array) {
        return array.map(function (value) {
            return value === null ? null : Number(value.toFixed(2));
        });
    }

    var expectedData = [
        303778881,
        209378883,
        321644078,
        108824968,
        612690610,
        1114360905,
        447747531,
        246572396,
        266346514,
        0,
        626460184,
        506662835
    ];

    var base = chart.series[0],
        volume = chart.series[1],
        indicator = chart.series[2];

    assert.deepEqual(
        chart.series[2].group.translateX,
        chart.series[2].xAxis.left,
        'The vbp series is positioned correctly (non-inverted).'
    );

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
        [
            303778881,
            209378883,
            321644078,
            970044968,
            612690610,
            1114360905,
            447747531,
            246572396,
            266346514,
            0,
            626460184,
            506662835
        ],
        'volumeDataArray is correct after add two points on the base and the volume series.'
    );

    base.data[base.data.length - 1].remove(false);
    volume.data[volume.data.length - 1].remove();

    assert.deepEqual(
        round(indicator.volumeDataArray),
        [
            303778881,
            209378883,
            321644078,
            841324968,
            612690610,
            1114360905,
            447747531,
            246572396,
            266346514,
            0,
            626460184,
            506662835
        ],
        'volumeDataArray is correct after point remove on the base and the volume series.'
    );

    chart.series[0].points[14].update({
        open: 60,
        high: 90,
        low: 55,
        close: 80
    });
    const yData = chart.series[2].yData.slice();
    chart.series[0].points[14].update({
        open: 60,
        high: 150,
        low: 55,
        close: 140
    });

    assert.notDeepEqual(
        yData,
        chart.series[2].yData,
        `After multiple updates on the base series' point,
        the indicator should recalculate its values, #16397.`
    );

    const negativeGraphic = indicator.points[0].negativeGraphic;
    indicator.points[0].destroy();
    assert.notOk(
        negativeGraphic.element,
        '#16036: negativeGraphic should have been destroyed'
    );

    indicator.remove();
    assert.ok(
        chart.series.indexOf(indicator) === -1,
        'Indicator is removed after series remove.'
    );
});

QUnit.test('VBP series errors.', function (assert) {
    function createChart(volumeSeries, vbpSeries) {
        const chart = Highcharts.chart('container', {
            series: [{
                id: 'quotes',
                type: 'candlestick',
                data: [{
                    x: 1515042000000,
                    y: 99.6,
                    high: 100,
                    low: 99,
                    open: 99.5,
                    close: 99.6
                }, {
                    x: 1515042000001,
                    y: 99.6,
                    high: 100,
                    low: 99,
                    open: 99.5,
                    close: 99.6
                }]
            },
            volumeSeries,
            vbpSeries
            ]
        });
        chart.destroy();
    }

    assert.throws(
        () => createChart({
            id: 'volumes',
            type: 'column',
            data: [{
                x: 1515042000000,
                y: 1000
            }, {
                x: 1515042000001,
                y: 1001
            }]
        }, {
            linkedTo: 'quotes',
            type: 'vbp',
            params: {
                ranges: 1,
                volumeSeriesID: 'wrongID'
            }
        }),
        new Error('Series wrongID not found! Check `volumeSeriesID`.'),
        `VBP indicator should throw a correct error, when VBP indicator has
        wrong ID set.`
    );

    assert.throws(
        () => createChart({
            id: 'volumes',
            type: 'column',
            data: []
        }, {
            linkedTo: 'quotes',
            type: 'vbp',
            params: {
                ranges: 1,
                volumeSeriesID: 'volumes'
            }
        }),
        new Error('Series volumes does not contain any data.'),
        `VBP indicator should throw a correct error, when volume series linked
        to the indicator does not contain any data.`
    );

});

QUnit.test('YAxis extremes with VBP series.', function (assert) {
    const data = [[
            1631539800000,
            150.63,
            151.42,
            148.75,
            149.55
        ], [
            1631626200000,
            150.35,
            151.07,
            146.91,
            148.12
        ], [
            1631712600000,
            148.56,
            149.44,
            146.37,
            149.03
        ], [
            1631799000000,
            148.44,
            148.97,
            147.22,
            148.79
        ], [
            1631885400000,
            148.82,
            148.82,
            145.76,
            146.06
        ]],
        volume = [[
            1631539800000,
            102404300
        ], [
            1631626200000,
            109296300
        ], [
            1631712600000,
            83281300
        ], [
            1631799000000,
            68034100
        ], [
            1631885400000,
            129868800
        ]];


    const chart = Highcharts.stockChart('container', {
        yAxis: [{
            height: '60%'
        }, {
            top: '65%',
            height: '35%',
            offset: 0
        }],
        series: [{
            type: 'candlestick',
            id: 'AAPL',
            name: 'AAPL',
            data: data
        }, {
            type: 'column',
            id: 'volume',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: 'AAPL',
            showInLegend: true,
            compare: 'percent'
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        144,
        'YAxis min should remain unnaffected after adding VBP to chart, #16686.'
    );
    assert.strictEqual(
        chart.yAxis[0].max,
        152,
        'YAxis max should remain unnaffected after adding VBP to chart, #16686.'
    );
});