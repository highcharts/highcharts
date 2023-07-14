QUnit.test('Zones on macd with no data.', function (assert) {
    Highcharts.stockChart('container', {
        yAxis: [
            {
                height: '50%'
            },
            {
                top: '60%',
                height: '40%'
            }
        ],
        series: [
            {
                id: 'main',
                data: []
            },
            {
                yAxis: 1,
                type: 'macd',
                linkedTo: 'main',
                params: {
                    shortPeriod: 12,
                    longPeriod: 26,
                    signalPeriod: 9,
                    period: 26
                },
                macdLine: {
                    zones: [
                        {
                            value: 0,
                            color: 'green'
                        },
                        {
                            color: 'red'
                        }
                    ]
                }
            }
        ]
    });

    // We expect no JS error when applying zones on macd and chart has no data.
    assert.expect(0);
});

QUnit.test('Test algorithm on data updates.', function (assert) {
    var chart = Highcharts.stockChart('container', {
            yAxis: [
                {
                    height: '50%'
                },
                {
                    top: '60%',
                    height: '40%'
                }
            ],
            series: [
                {
                    id: 'main',
                    data: [
                        459.99,
                        448.85,
                        446.06,
                        450.81,
                        442.8,
                        448.97,
                        444.57,
                        441.4,
                        430.47,
                        420.05,
                        431.14,
                        425.66,
                        430.58,
                        431.72,
                        437.87,
                        428.43,
                        428.35,
                        432.5,
                        443.66,
                        455.72,
                        454.49,
                        452.08,
                        452.73,
                        461.91,
                        463.58,
                        461.14,
                        452.08,
                        442.66,
                        428.91,
                        429.79,
                        431.99,
                        427.72,
                        423.2,
                        426.21,
                        426.98,
                        435.69,
                        434.338
                    ]
                },
                {
                    yAxis: 1,
                    type: 'macd',
                    linkedTo: 'main',
                    params: {
                        shortPeriod: 12,
                        longPeriod: 26,
                        signalPeriod: 9,
                        period: 26
                    }
                }
            ]
        }),
        lastPoint;

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period -
            1,
        'Initial number of MACD points is correct'
    );

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 8.275269503894606],
            [0, null, 7.703378381440018],
            [0, null, 6.4160747569500245],
            [0, null, 4.237519783259984],
            [0, null, 2.552583324859995],
            [0, null, 1.3788857198500182],
            [0, null, 0.10298149120001199],
            [0, null, -1.2584019528],
            [-5.1080840588194, 3.0375258687294098, -2.0705581900899688],
            [-4.5274945575835, 1.9056522293335, -2.6218423282499543],
            [-3.3877751758268, 1.0587084353768, -2.3290667404500027],
            [-2.5917618988214, 0.41076796067144, -2.1809939381499817]
        ],
        'Correct values'
    );

    chart.series[0].addPoint(429.8);

    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length +
            chart.series[1].options.params.period -
            1,
        'After addPoint number of MACD points is correct'
    );

    chart.series[0].update({ cropThreshold: 3 });
    chart.series[1].update({ cropThreshold: 3 });
    chart.xAxis[0].setExtremes(30);

    lastPoint = chart.series[0].points[chart.series[0].points.length - 1];
    lastPoint.update({ y: 434.31 });

    assert.strictEqual(
        chart.series[1].MACDData.some(function (elem) {
            return !Highcharts.isNumber(elem) || !Highcharts.defined(elem);
        }),
        false,
        'MACDData should an array of numbers (#10774).'
    );

    assert.strictEqual(
        chart.series[1].signalData.some(function (elem) {
            return Highcharts.isArray(elem);
        }),
        false,
        'signalData should not be an array of arrays (#10774).'
    );

    chart.series[1].update({
        params: {
            shortPeriod: 8,
            longPeriod: 16,
            signalPeriod: 9,
            period: 16
        }
    });

    assert.strictEqual(
        chart.series[1].points.length > 0,
        true,
        'Long and short SMA / EMA are correct.'
    );

    chart.series[0].setData(
        [
            459.99,
            448.85,
            446.06,
            450.81,
            442.8,
            448.97,
            444.57,
            441.4,
            430.47,
            420.05,
            431.14,
            425.66,
            430.58,
            431.72,
            437.87,
            428.43,
            428.35,
            432.5,
            443.66,
            455.72,
            454.49,
            452.08,
            452.73,
            461.91,
            463.58,
            461.14,
            452.08,
            442.66,
            428.91,
            429.79,
            431.99,
            427.72,
            423.2,
            426.21,
            426.98,
            435.69,
            434.33
        ],
        false
    );

    chart.series[1].update({
        signalLine: {
            styles: {
                lineWidth: 10,
                lineColor: 'red'
            }
        },
        macdLine: {
            styles: {
                lineWidth: 10,
                lineColor: 'blue'
            }
        },
        params: {
            shortPeriod: 10,
            longPeriod: 24,
            signalPeriod: 7,
            period: 24
        }
    });
    chart.xAxis[0].setExtremes();

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 6.660611645503252], // [histogram, signal, macd]
            [0, null, 7.677330740260004],
            [0, null, 8.082536302640051],
            [0, null, 7.347508688820028],
            [0, null, 5.728233231320019],
            [0, null, 3.026040676299999],
            [-4.6137988919462, 5.651410398816195, 1.0376115068700074],
            [-4.4262272164997, 4.1760013266497, -0.25022588984995764],
            [-4.3700561511823, 2.7193159429223, -1.6507402082600038],
            [-4.3953516672392, 1.2541987205092, -3.14115294672996],
            [-3.8737978188144, -0.037067219095604, -3.910865037910014],
            [-3.2384218442658, -1.1165411671842, -4.354963011449968],
            [-1.9668939154094, -1.7721724723206, -3.739066387729963],
            [-1.1905335274795, -2.1690169814805, -3.3595505089600124]
        ],
        'Correct values'
    );

    assert.strictEqual(
        chart.series[1].graphsignal.attr('stroke'),
        'red',
        'Line color changed'
    );

    assert.strictEqual(
        chart.series[1].graphmacd.attr('stroke'),
        'blue',
        'Line color changed'
    );

    chart.series[0].points[27].remove();

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 6.660611645503252], // [histogram, signal, macd]
            [0, null, 7.677330740260004],
            [0, null, 8.082536302640051],
            [0, null, 7.347508688820028],
            [0, null, 4.3282332313199845],
            [0, null, 2.0821861308500047],
            [-4.6667104952448, 5.251949374024759, 0.5852388787799896],
            [-4.6775847896886, 3.6927544441286, -0.9848303455599989],
            [-4.7289840687815, 2.1164264212015, -2.6125576475799903],
            [-4.2073089268511, 0.71399011225112, -3.493318814600002],
            [-3.5558024760008, -0.47127737974916, -4.027079855750003],
            [-2.2591251736131, -1.2243191042869, -3.4834442779000483],
            [-1.4532902209598, -1.7087491779402, -3.162039398899992]
        ],
        'Values should be recalculated after point.remove()'
    );

    chart.series[0].update({
        dataGrouping: {
            forced: true
        }
    });

    assert.ok(
        chart.series[1].currentDataGrouping !== undefined,
        'DataGrouping applied to MACD series too (#7823).'
    );

    Highcharts.Series.types.macd.prototype.getValues(
        {
            xData: [0],
            yData: [1]
        },
        Highcharts.getOptions().plotOptions.macd.params
    );

    assert.ok(
        true,
        'No error when longPeriod is greater than data length (#8376).'
    );

    Highcharts.Series.types.macd.prototype.getValues(
        {
            xData: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            yData: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
        },
        Highcharts.getOptions().plotOptions.macd.params
    );

    assert.ok(
        true,
        'No error when periods are greater than data length (#8847).'
    );

    // Last test: destroy MACD:
    chart.series[1].remove();
    assert.ok(true, 'No error when removing MACD without lines (#8848).');
});

QUnit.test('After changing the MACD params all points should calculate properly, #14197.', function (assert) {
    const chart = Highcharts.stockChart('container', {
            yAxis: [{
                height: '60%'
            }, {
                top: '60%',
                height: '20%'
            }, {
                top: '80%',
                height: '20%'
            }],
            series: [
                {
                    id: 'main',
                    data: [
                        459.99,
                        448.85,
                        446.06,
                        450.81,
                        442.8,
                        448.97,
                        444.57,
                        441.4,
                        430.47,
                        420.05,
                        431.14,
                        425.66,
                        430.58,
                        431.72,
                        437.87,
                        428.43,
                        428.35,
                        432.5,
                        443.66,
                        455.72,
                        454.49,
                        452.08,
                        452.73,
                        461.91,
                        463.58,
                        461.14,
                        452.08,
                        442.66,
                        428.91,
                        429.79,
                        431.99,
                        427.72,
                        423.2,
                        426.21,
                        426.98,
                        435.69,
                        434.338
                    ]
                }, {
                    yAxis: 1,
                    type: 'macd',
                    linkedTo: 'main',
                    params: {
                        shortPeriod: 10,
                        longPeriod: 20
                    }
                }, {
                    yAxis: 2,
                    type: 'macd',
                    linkedTo: 'main',
                    params: {
                        shortPeriod: 13,
                        longPeriod: 28
                    }
                }
            ]
        }),
        seriesPoints = chart.series[0].points,
        firstMACD = chart.series[1].points,
        secondMACCD = chart.series[2].points;

    assert.strictEqual(
        seriesPoints[seriesPoints.length - 1].x,
        firstMACD[firstMACD.length - 1].x,
        `After changing the short period to 10, the x value of the last MACD
        point should be the same as the main series(ending at the same point).`
    );
    const firstMACDstartPoint = chart.series[1].options.params.longPeriod;

    assert.strictEqual(
        firstMACDstartPoint - 1, // subtracting 1 because series starts from 0
        firstMACD[0].x,
        `Change of the short period should not influence on the beginning of
        the MACD series which should start from the long period value.`
    );

    assert.strictEqual(
        chart.series[1].points[0].graphic.attr('fill'),
        Highcharts.getOptions().colors[1],
        `When colour is not specified, each element (columns) should get it
        from the colour array.`
    );
    assert.strictEqual(
        chart.series[1].graphsignal.attr('stroke'),
        Highcharts.getOptions().colors[2],
        `When colour is not specified, each element (signalLine) should get it
        from the colour array.`
    );
    assert.strictEqual(
        chart.series[1].graphmacd.attr('stroke'),
        Highcharts.getOptions().colors[3],
        `When colour is not specified, each element (macdLine) should get it
        from the colour array.`
    );

    assert.strictEqual(
        seriesPoints[seriesPoints.length - 1].x,
        secondMACCD[secondMACCD.length - 1].x,
        `After changing the short period to 13, the x value of the last MACD
        point should be the same as the main series(ending at the same point).`
    );
    const secondMACDstartPoint = chart.series[2].options.params.longPeriod;

    assert.strictEqual(
        secondMACDstartPoint - 1, // subtracting 1 because series starts from 0
        secondMACCD[0].x,
        `Change of the short period should not influence on the beginning of
        the MACD series which should start from the long period value.`
    );
});

QUnit.test('#14977: Index param', assert => {
    const xData = [...Array(50).keys()];
    const yData = xData.map(() => {
        const y = Math.random();
        return [y, y * 2, y, y * 2];
    });

    const getValues = index =>
        Highcharts.Series.types.macd.prototype.getValues({
            xData,
            yData
        }, Highcharts.merge(
            Highcharts.getOptions().plotOptions.macd.params,
            { index }
        )).values;

    assert.notStrictEqual(
        getValues(0)[0][3],
        getValues(1)[0][3],
        'getValues should return different values when passed different index param'
    );
});
