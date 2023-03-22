QUnit.test('Item series dynamics', assert => {
    const {
        series: [series]
    } = Highcharts.chart('container', {
        series: [
            {
                type: 'item',
                data: [1, 2, 3, 4]
            }
        ]
    });

    assert.strictEqual(series.points.length, 4, 'Four initial points');

    series.addPoint(5);
    assert.strictEqual(series.points.length, 5, 'One point added');

    series.points[3].update(100);
    assert.strictEqual(series.total, 111, 'Total should be modified');

    series.points[3].remove();
    assert.strictEqual(series.total, 11, 'Total should be modified');
    assert.strictEqual(series.points.length, 4, 'Point length modified');

    series.points[0].update({ color: '#c76ab8' });
    assert.strictEqual(
        series.points[0].graphics[0].element.attributes.fill.value,
        series.points[0].color,
        'Circles color should update when the point updates (#17257)'
    );
});

QUnit.test('Full circle- points should not overlap.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'item'
        },
        series: [
            {
                keys: ['name', 'y', 'color'],
                data: [
                    ['a', 5, 'rgba(200,0,200,0.3)'],
                    ['b', 5, 'rgba(0,200,0,0.3)']
                ],
                center: ['50%', '50%'],
                size: '100%',
                rows: 1,
                startAngle: -180,
                endAngle: 180
            }
        ]
    });

    assert.notEqual(
        Math.round(chart.series[0].points[0].graphics[0].x),
        Math.round(chart.series[0].points[1].graphics[4].x),
        'Points are not overlapped.'
    );
});

QUnit.test(
    'The chart should be displayed properly without setting the series size.',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'item'
            },
            series: [
                {
                    keys: ['name', 'y', 'color'],
                    data: [
                        ['a', 5, 'rgba(200,0,200,0.3)'],
                        ['b', 5, 'rgba(0,200,0,0.3)']
                    ],
                    center: ['50%', '50%'],
                    startAngle: -100,
                    endAngle: 100,
                    dataLabels: {
                        enabled: true
                    }
                }
            ]
        });

        assert.strictEqual(
            'a',
            chart.series[0].data[0].dataLabel.text.textStr,
            'Data label is displayed without setting series size.'
        );

        const previousCenter = chart.series[0].center;

        chart.setSize(400, 500);

        assert.notEqual(
            previousCenter,
            chart.series[0].center,
            'The chart with data label is displayed properly after changing chart size.'
        );
    }
);

QUnit.test(
    'Drilldown in horizontal series should be allowed #13372.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'item'
            },
            series: [
                {
                    name: 'root',
                    data: [
                        {
                            y: 5,
                            color: 'rgba(200,0,200,0.8)',
                            drilldown: 'a'
                        },
                        {
                            y: 4,
                            color: 'rgba(0,200,0,0.8)',
                            drilldown: 'b'
                        }
                    ]
                }
            ],

            drilldown: {
                animation: {
                    duration: 2000
                },
                series: [
                    {
                        id: 'a',
                        data: [
                            {
                                name: 'a1',
                                y: 2,
                                color: 'rgba(200,0,200,0.8)'
                            },
                            {
                                name: 'a2',
                                y: 3,
                                color: 'rgba(150,0,150,0.8)'
                            }
                        ]
                    },
                    {
                        id: 'b',
                        data: [
                            {
                                name: 'b1',
                                y: 1,
                                color: 'rgba(0,200,0,0.8)'
                            },
                            {
                                name: 'b2',
                                y: 3,
                                color: 'rgba(0,150,0,0.8)'
                            }
                        ]
                    }
                ]
            }
        });

        chart.series[0].points[0].doDrilldown();
        assert.ok(chart.drilldownLevels[0], 'Drilldown works.');

        chart.drillUp();
        assert.deepEqual(chart.drilldownLevels, [], 'Drillup works.');
    }
);
