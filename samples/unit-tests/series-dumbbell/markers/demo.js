QUnit.test('Markers and zones for dumbbell.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'dumbbell',
            width: 600
        },

        series: [
            {
                data: [
                    [0, 10],
                    [10, 20],
                    {
                        low: 30,
                        high: 35,
                        lowColor: '#ff69b4',
                        connectorColor: '#000000'
                    },
                    [30, 31]
                ],
                zones: [
                    {
                        value: 15,
                        color: '#ff0000'
                    },
                    {
                        value: 25,
                        color: '#ffff00'
                    },
                    {
                        color: '#d3d3d3'
                    }
                ],
                marker: {
                    enabled: true
                },
                color: '#0000ff',
                lowColor: '#00ff00'
            }
        ]
    });

    assert.deepEqual(
        chart.series[0].points.map(function (p) {
            return [
                p.graphics[1].attr('fill'),
                p.graphics[0].attr('fill'),
                p.connector.attr('stroke')
            ];
        }),
        [
            ['#ff0000', '#00ff00', '#ff0000'],
            ['#ffff00', '#00ff00', '#ffff00'],
            ['#d3d3d3', '#ff69b4', '#000000'],
            ['#d3d3d3', '#00ff00', '#d3d3d3']
        ],
        'Upper and lower markers with connector should individually respect all the colors settings.'
    );

    // Testing setState()
    chart.series[0].points[1].setState('hover');

    assert.strictEqual(
        chart.series[0].points[1].graphics[1].attr('fill'),
        '#ffff00',
        'The upper marker should have a correct color on hover.'
    );

    assert.strictEqual(
        chart.series[0].points[1].graphics[0].attr('fill'),
        chart.series[0].lowColor,
        'The lower marker should have a correct color (lowColor) on hover.'
    );

    chart.series[0].points[1].setState('');

    assert.strictEqual(
        chart.series[0].points[1].graphics[1].attr('fill'),
        '#ffff00',
        'The upper marker should have a correct color without any state.'
    );

    assert.strictEqual(
        chart.series[0].points[1].graphics[0].attr('fill'),
        chart.series[0].lowColor,
        'The lower marker should have a correct color (lowColor) without any state.'
    );

    // Color all upper graphics
    chart.series[0].update({
        marker: {
            fillColor: '#ffa500'
        }
    });

    // Mouse over and mouse out of the point
    chart.series[0].points[1].setState('hover');
    chart.series[0].points[1].setState('');

    assert.strictEqual(
        chart.series[0].points[1].graphics[1].attr('fill'),
        chart.series[0].options.marker.fillColor,
        'After mouseOut (without any state), the upper marker should have a correct color.'
    );
});

QUnit.test('setData() and marker update for dumbbell.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'dumbbell',
            width: 600
        },

        series: [
            {
                data: [
                    [0, 10],
                    [10, 20],
                    [30, 35],
                    [30, 31]
                ]
            }
        ]
    });

    chart.series[0].setData([
        [50, 60],
        [50, 60],
        [50, 60]
    ]);

    chart.series[0].points.forEach(point => {
        assert.ok(
            point.graphics[0] !== undefined,
            'Bottom marker for point: x=' + point.x + ' exists.'
        );
        assert.ok(
            point.graphics[1] !== undefined,
            'Top marker for point: x=' + point.x + ' exists.'
        );
        assert.ok(
            point.connector !== undefined,
            'Connector for point: x=' + point.x + ' exists.'
        );
    });

    chart.series[0].points[1].update({
        marker: {
            fillColor: '#ff0000'
        }
    });

    assert.strictEqual(
        chart.series[0].points[1].graphics[1].attr('fill'),
        '#ff0000',
        'After point.marker.fillColor update, the graphics[1] should have a correct color.'
    );

    chart.series[0].update({
        lowColor: '#000000'
    });

    chart.series[0].points.forEach(function (point) {
        assert.strictEqual(
            point.graphics[0].attr('fill'),
            '#000000',
            'After series.lowColor update, all the graphics[0]s should have a correct color.'
        );
    });
});
