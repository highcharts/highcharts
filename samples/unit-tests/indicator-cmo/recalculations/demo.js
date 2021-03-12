// Formula (in percents): chandePointValue = (sH - sL) / (sH + sL) * 100

// Where:
// sH = sum of the difference between the current value and previous value
// on "up days" for the specified period.
// sL = sum of the absolute value of the difference between the current value
// and the previous value on "down days" for the specified period.

// Where 2:
// "Up days" are days when the current value is greater than the previous value.
// "Down days" are days when the current value is lower than the previous value.


QUnit.skip(
    'Testing Chande Momentum Oscillator (values and updates), #15142.',
    function (assert) {
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

        assert.strictEqual(
            chart.series[1].yData,
            [
                -16.591115140525435,
                -80.5280528052808,
                -100,
                -100,
                -100,
                -55.855855855856085,
                -77.80415430267053,
                15.515961395693806,
                100,
                100,
                -72.78978388998047,
                -69.9273337059809,
                34.069981583793535,
                100,
                100,
                97.14782608695648,
                79.05849775008629,
                72.62247838616717,
                100,
                100,
                76.50933040614682,
                -100,
                -100,
                -100,
                -98.26052579561178,
                -83.80119650253113,
                -100,
                -100,
                -63.69119420989189,
                -30.587337909991707,
                100,
                92.13190627711879
            ],
            'Chande values should be correct.'
        );

        chart.series[0].addPoint(429.8);

        testNumberOfPoints(
            'After addPoint: number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.strictEqual(
            chart.series[1].yData,
            [
                -16.591115140525435,
                -80.5280528052808,
                -100,
                -100,
                -100,
                -55.855855855856085,
                -77.80415430267053,
                15.515961395693806,
                100,
                100,
                -72.78978388998047,
                -69.9273337059809,
                34.069981583793535,
                100,
                100,
                97.14782608695648,
                79.05849775008629,
                72.62247838616717,
                100,
                100,
                76.50933040614682,
                -100,
                -100,
                -100,
                -98.26052579561178,
                -83.80119650253113,
                -100,
                -100,
                -63.69119420989189,
                -30.587337909991707,
                100,
                92.13190627711879,
                11.054204011950866
            ],
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

        testNumberOfPoints(
            'After setData (ohlc format): number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.strictEqual(
            chart.series[1].yData,
            [
                -55.55555555555556,
                100,
                -85.71428571428571,
                -100,
                -55.55555555555556,
                66.66666666666666,
                84.61538461538461
            ],
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

        assert.strictEqual(
            chart.series[1].yData,
            [-46.666666666666664, 68.42105263157895, 90.9090909090909],
            'After period update: Chande values should be correct.'
        );

        chart.series[0].points[chart.series[0].points.length - 1].remove();

        testNumberOfPoints(
            'After point remove:' +
            ' number of Chande points should be equal' +
            ' to number of main series points plus period.'
        );

        assert.strictEqual(
            chart.series[1].yData,
            [-46.666666666666664, 68.42105263157895],
            'After point remove: Chande values should be correct.'
        );
    }
);
