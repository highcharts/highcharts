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

    series.setData([{
        y: 3,
        marker: {
            symbol: 'url(data:image/svg+xml;base64,PHN2ZyBpZD0ibWFsZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTkyIDUxMiI+PHBhdGggZD0iTTk2IDBjMzUuMzQ2IDAgNjQgMjguNjU0IDY0IDY0cy0yOC42NTQgNjQtNjQgNjQtNjQtMjguNjU0LTY0LTY0UzYwLjY1NCAwIDk2IDBtNDggMTQ0aC0xMS4zNmMtMjIuNzExIDEwLjQ0My00OS41OSAxMC44OTQtNzMuMjggMEg0OGMtMjYuNTEgMC00OCAyMS40OS00OCA0OHYxMzZjMCAxMy4yNTUgMTAuNzQ1IDI0IDI0IDI0aDE2djEzNmMwIDEzLjI1NSAxMC43NDUgMjQgMjQgMjRoNjRjMTMuMjU1IDAgMjQtMTAuNzQ1IDI0LTI0VjM1MmgxNmMxMy4yNTUgMCAyNC0xMC43NDUgMjQtMjRWMTkyYzAtMjYuNTEtMjEuNDktNDgtNDgtNDh6IiBmaWxsPSIjMkQ1RkYzIi8+PC9zdmc+)'
        }
    }, {
        y: 2,
        marker: {
            symbol: 'url(data:image/svg+xml;base64,PHN2ZyBpZD0iZmVtYWxlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgNTEyIj48cGF0aCBkPSJNMTI4IDBjMzUuMzQ2IDAgNjQgMjguNjU0IDY0IDY0cy0yOC42NTQgNjQtNjQgNjRjLTM1LjM0NiAwLTY0LTI4LjY1NC02NC02NFM5Mi42NTQgMCAxMjggMG0xMTkuMjgzIDM1NC4xNzlsLTQ4LTE5MkEyNCAyNCAwIDAgMCAxNzYgMTQ0aC0xMS4zNmMtMjIuNzExIDEwLjQ0My00OS41OSAxMC44OTQtNzMuMjggMEg4MGEyNCAyNCAwIDAgMC0yMy4yODMgMTguMTc5bC00OCAxOTJDNC45MzUgMzY5LjMwNSAxNi4zODMgMzg0IDMyIDM4NGg1NnYxMDRjMCAxMy4yNTUgMTAuNzQ1IDI0IDI0IDI0aDMyYzEzLjI1NSAwIDI0LTEwLjc0NSAyNC0yNFYzODRoNTZjMTUuNTkxIDAgMjcuMDcxLTE0LjY3MSAyMy4yODMtMjkuODIxeiIgZmlsbD0iI0YyM0EyRiIvPjwvc3ZnPg==)'
        }
    }]);

    const {
        width: beforeWidth,
        height: beforeHeight
    } = series.points[0].graphics[0].element.getBBox();

    // simulate a legend item click with redraw and centering images, #17315
    series.points[0].setVisible();
    series.points[0].setVisible();

    const {
        width: afterWidth,
        height: afterHeight
    } = series.points[0].graphics[0].element.getBBox();

    assert.strictEqual(
        beforeWidth,
        afterWidth,
        'Width of image-symbol should not be changed after redraw, #17315.'
    );

    assert.strictEqual(
        beforeHeight,
        afterHeight,
        'Height of image-symbol should not be changed after redraw, #17315.'
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
