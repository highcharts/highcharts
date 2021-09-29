// Formula (in percents): chandePointValue = (sH - sL) / (sH + sL) * 100

// Where:
// sH = sum of the difference between the current value and previous value
// on "up days" for the specified period.
// sL = sum of the absolute value of the difference between the current value
// and the previous value on "down days" for the specified period.

// Where 2:
// "Up days" are days when the current value is greater than the previous value.
// "Down days" are days when the current value is lower than the previous value.


QUnit.test(
    'Testing Chande Momentum Oscillator (values and updates), #15142.',
    function (assert) {

        function round(array) {
            return array.map(function (value) {
                return value === null ? null : Number(value.toFixed(8));
            });
        }

        const chart = Highcharts.stockChart('container', {
                yAxis: [{
                    height: '48%'
                }, {
                    height: '48%',
                    top: '52%'
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
                        434.33
                    ]
                }, {
                    type: 'cmo',
                    linkedTo: 'main',
                    yAxis: 1,
                    params: {
                        period: 5
                    }
                }]
            }),
            testNumberOfPoints = textDescription => {
                assert.strictEqual(
                    chart.series[0].points.length,
                    chart.series[1].points.length +
                        chart.series[1].options.params.period,
                    textDescription
                );
            };

        testNumberOfPoints(
            'Initial number of Chande points should be equal to ' +
            'number of main series points plus period.'
        );

        assert.deepEqual(
            round(chart.series[1].yData),
            round([
                -33.53621424223974,
                -16.38591117917312,
                -17.584905660377416,
                -62.23990208078326,
                -64.83328583642057,
                -44.56385903524131,
                -46.02092966658556,
                -25.2567693744165,
                3.7821482602118053,
                61.9179986101461,
                -9.988942130482807,
                12.379199263690762,
                9.160305343511535,
                38.54099418979991,
                48.38709677419363,
                90.8647140864714,
                76.52370203160247,
                73.53689567430004,
                71.48452800626688,
                51.9154557463668,
                40.67278287461754,
                0,
                -31.69656909033685,
                -90.80902586681363,
                -95.04922644163153,
                -82.55451713395645,
                -79.81651376146795,
                -75.9562841530056,
                -18.145161290322893,
                -19.025050778605245,
                17.387218045112704,
                35.982580293957184
            ]),
            'Chande values should be correct.'
        );

        chart.series[0].addPoint(429.8);

        testNumberOfPoints(
            'After addPoint: number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.deepEqual(
            round(chart.series[1].yData),
            round([
                -33.53621424223974,
                -16.38591117917312,
                -17.584905660377416,
                -62.23990208078326,
                -64.83328583642057,
                -44.56385903524131,
                -46.02092966658556,
                -25.2567693744165,
                3.7821482602118053,
                61.9179986101461,
                -9.988942130482807,
                12.379199263690762,
                9.160305343511535,
                38.54099418979991,
                48.38709677419363,
                90.8647140864714,
                76.52370203160247,
                73.53689567430004,
                71.48452800626688,
                51.9154557463668,
                40.67278287461754,
                0,
                -31.69656909033685,
                -90.80902586681363,
                -95.04922644163153,
                -82.55451713395645,
                -79.81651376146795,
                -75.9562841530056,
                -18.145161290322893,
                -19.025050778605245,
                17.387218045112704,
                35.982580293957184,
                35.90859630032657
            ]),
            'After addPoint: Chande values should be correct.'
        );

        chart.series[0].setData([
            [1533772800000, 20, 30, 10, 25],
            [1533859200000, 20, 30, 10, 23],
            [1534118400000, 20, 30, 10, 21],
            [1534204800000, 20, 30, 10, 25],
            [1534291200000, 20, 30, 10, 26],
            [1534377600000, 20, 30, 10, 23],
            [1534464000000, 20, 30, 10, 27],
            [1534723200000, 20, 30, 10, 22],
            [1534809600000, 20, 30, 10, 22],
            [1534896000000, 20, 30, 10, 23],
            [1534982400000, 20, 30, 10, 25],
            [1535068800000, 20, 30, 10, 26]
        ]);

        chart.series[0].update({
            type: 'ohlc'
        });

        chart.series[1].update({});

        testNumberOfPoints(
            'After setData (ohlc format): number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.deepEqual(
            round(chart.series[1].yData),
            round([
                -16.666666666666664,
                28.57142857142857,
                5.88235294117647,
                -23.076923076923077,
                -23.076923076923077,
                16.666666666666664,
                -11.11111111111111
            ]),
            'After setData (ohlc format): Chande values should be correct.'
        );

        chart.series[1].update({
            params: {
                period: 9
            }
        });

        testNumberOfPoints(
            'After period update:' +
            ' number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.deepEqual(
            round(chart.series[1].yData),
            round([-9.090909090909092, 9.090909090909092, 23.809523809523807]),
            'After period update: Chande values should be correct.'
        );

        chart.series[0].points[chart.series[0].points.length - 1].remove();

        testNumberOfPoints(
            'After point remove:' +
            ' number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.deepEqual(
            round(chart.series[1].yData),
            round([-9.090909090909092, 9.090909090909092]),
            'After point remove: Chande values should be correct.'
        );
    }
);
