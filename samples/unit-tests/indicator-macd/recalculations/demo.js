QUnit.test('Zones on macd with no data.', function (assert) {

    Highcharts.stockChart('container', {
        yAxis: [{
            height: '50%'
        }, {
            top: '60%',
            height: '40%'
        }],
        series: [{
            id: 'main',
            data: []
        }, {
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
                zones: [{
                    value: 0,
                    color: 'green'
                }, {
                    color: 'red'
                }]
            }
        }]
    });

    // We expect no JS error when applying zones on macd and chart has no data.
    assert.expect(0);

});

QUnit.test('Test algorithm on data updates.', function (assert) {

    var chart = Highcharts.stockChart('container', {
            yAxis: [{
                height: '50%'
            }, {
                top: '60%',
                height: '40%'
            }],
            series: [{
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
                    shortPeriod: 12,
                    longPeriod: 26,
                    signalPeriod: 9,
                    period: 26
                }
            }]
        }),
        lastPoint;


    assert.strictEqual(
        chart.series[0].points.length,
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
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
        chart.series[1].points.length + chart.series[1].options.params.period - 1,
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

    chart.series[0].setData([
        [1435017600000, 0, 0, 0, 0],
        [1435104000000, 0, 0, 0, 0],
        [1435190400000, 0, 0, 0, 0],
        [1435276800000, 0, 0, 0, 0],
        [1435363200000, 0, 0, 0, 0],
        [1435449600000, 0, 0, 0, 0],
        [1435536000000, 0, 0, 0, 0],
        [1435622400000, 0, 0, 0, 0],
        [1435708800000, 0, 0, 0, 0],
        [1435795200000, 0, 0, 0, 0],
        [1435881600000, 0, 0, 0, 0],
        [1435968000000, 0, 0, 0, 0],
        [1436054400000, 0, 0, 0, 0],
        [1436140800000, 0, 0, 0, 0],
        [1436227200000, 0, 0, 0, 0],
        [1436313600000, 0, 0, 0, 0],
        [1436400000000, 0, 0, 0, 0],
        [1436486400000, 0, 0, 0, 0],
        [1436572800000, 0, 0, 0, 0],
        [1436659200000, 0, 0, 0, 0],
        [1436745600000, 0, 0, 0, 0],
        [1436832000000, 0, 0, 0, 0],
        [1436918400000, 0, 0, 0, 0],
        [1437004800000, 0, 0, 0, 0],
        [1437091200000, 0, 0, 0, 0],
        [1437177600000, 0, 0, 0, 0],
        [1437264000000, 0, 0, 0, 0],
        [1437350400000, 0, 0, 0, 0],
        [1437436800000, 0, 0, 0, 0],
        [1437523200000, 0, 0, 0, 0],
        [1437609600000, 0, 0, 0, 0],
        [1437696000000, 0, 0, 0, 0],
        [1437782400000, 0, 0, 0, 0],
        [1437868800000, 0, 0, 0, 0],
        [1437955200000, 0, 0, 0, 0],
        [1438041600000, 0, 0, 0, 0],
        [1438128000000, 0, 0, 0, 0],
        [1438214400000, 0, 0, 0, 0],
        [1438300800000, 0, 0, 0, 0],
        [1438387200000, 0, 0, 0, 0],
        [1438473600000, 0, 0, 0, 0],
        [1438560000000, 0, 0, 0, 0],
        [1438646400000, 0, 0, 0, 0],
        [1438732800000, 0, 0, 0, 0],
        [1438819200000, 0, 0, 0, 0],
        [1491955200000, 0.0403, 0.0355, 0.03569, 0.0381],
        [1492041600000, 0.04398, 0.03794, 0.0381, 0.04253],
        [1492128000000, 0.04266, 0.03898, 0.04253, 0.04012]
    ]);
    /*
    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, null, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0.002571851851851852, 0.0006429629629629631, 0.0032148148148148153],
            [0.004278005275931203, 0.001712464281945764, 0.005990469557876967],
            [0.005023277556609541, 0.0029682836710981497, 0.00799156122770769]
        ],
        'Correct values'
    );
*/
    chart.series[0].setData([
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
    ], false);

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

    assert.deepEqual(
        chart.series[1].yData,
        [
            [0, null, 2.009761429293235], [0, null, 1.89936238155002], [0, null, 3.495107645510018],
            [0, null, 5.685067060259996], [0, null, 7.728053717040041], [0, null, 8.87498471007001],
            [2.7551900116424, 5.40792115922762, 8.163111170870025],
            [-0.29114458390317, 5.3108729645932, 5.019728380690026],
            [-1.7051015772624, 4.7425057721724, 3.037404194909982],
            [-1.8372917917743, 4.1300751749143, 2.2927833831400335],
            [-2.4903351390182, 3.2999634619082, 0.8096283228899779],
            [-3.3599830199836, 2.1799691219137, -1.1800138980699444],
            [-3.7837396762978, 0.91872256314778, -2.8650171131499746],
            [-3.6746291128633, -0.30615380780666, -3.9807829206699807]
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
            [0, null, 2.009761429293235], [0, null, 1.89936238155002], [0, null, 3.495107645510018],
            [0, null, 5.685067060259996], [0, null, 8.828053717040007], [0, null, 9.816584710070003],
            [0.91233744021383, 5.441045730656185, 6.353383170870018],
            [-0.99759124156209, 5.1085153168021, 4.110924075240007],
            [-1.4652281468866, 4.6201059345066, 3.1548777876199665],
            [-2.3400513629525, 3.8400888135225, 1.5000374505700051],
            [-3.3517260665044, 2.7228467913544, -0.6288792751499841],
            [-3.8621861274858, 1.4354514155258, -2.426734711960023],
            [-3.8019554226344, 0.16813294131435, -3.63382248132001]
        ],
        'Correct values after point.remove()'
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


    Highcharts.seriesTypes.macd.prototype.getValues(
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

    Highcharts.seriesTypes.macd.prototype.getValues(
        {
            xData: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            yData: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
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
    assert.ok(
        true,
        'No error when removing MACD without lines (#8848).'
    );
});
