(function () {
    function runTests(chart, assert) {
        function getNames() {
            return chart.series
                .filter(function (s) {
                    return !s.options.isInternal;
                })
                .map(function (s) {
                    return s.name;
                })
                .join(',');
        }

        chart.update(
            {
                series: [
                    {
                        name: 'First series'
                    }
                ]
            },
            true,
            true
        );

        assert.strictEqual(getNames(), 'First series', 'One series only');

        chart.update(
            {
                series: [
                    {},
                    {
                        name: 'Second series',
                        data: [3, 1, 2, 4]
                    }
                ]
            },
            true,
            true
        );

        assert.strictEqual(
            getNames(),
            'First series,Second series',
            'Second series added'
        );

        chart.update(
            {
                title: {
                    text: 'Modified'
                }
            },
            true,
            true
        );

        assert.strictEqual(
            getNames(),
            'First series,Second series',
            'Undefined series property, nothing changed'
        );

        chart.update(
            {
                series: []
            },
            true,
            true
        );

        assert.strictEqual(
            getNames(),
            '',
            'Empty series property, all series removed'
        );

        chart.update(
            {
                series: [
                    {
                        name: 'One'
                    },
                    {
                        name: 'Two'
                    },
                    {
                        name: 'Three'
                    },
                    {
                        name: 'Four'
                    }
                ]
            },
            true,
            true
        );

        assert.strictEqual(getNames(), 'One,Two,Three,Four', 'All new series');

        chart.update(
            {
                series: [
                    {
                        data: [1, 2, 3]
                    },
                    {
                        data: [3, 2, 4]
                    },
                    {
                        data: [2, 4, 1]
                    }
                ]
            },
            true,
            true
        );

        assert.strictEqual(getNames(), 'One,Two,Three', 'Last series removed');

        chart.update(
            {
                series: [
                    {
                        id: 'one'
                    },
                    {
                        id: 'two'
                    },
                    {
                        id: 'three'
                    }
                ]
            },
            true,
            true
        );

        assert.strictEqual(getNames(), 'One,Two,Three', 'Added ids');

        chart.update(
            {
                series: [
                    {
                        id: 'one',
                        color: 'red'
                    },
                    {
                        id: 'three',
                        color: 'blue'
                    }
                ],
                yAxis: {
                    // Adding a Y axis here broke stock charts when reusing
                    // configs, #8196
                }
            },
            true,
            true
        );

        assert.strictEqual(
            getNames(),
            'One,Three',
            'Using ids, selective series updated'
        );
    }

    QUnit.test('Series update', function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 2, 3, 4]
                }
            ]
        });
        runTests(chart, assert);
    });

    QUnit.test(
        'Series update with Highcharts Stock (#8196)', function (assert) {
            var chart = Highcharts.stockChart('container', {
                series: [
                    {
                        data: [1, 2, 3, 4]
                    }
                ]
            });
            runTests(chart, assert);
        });
}());

QUnit.test('Series update with ids', assert => {
    const chart = Highcharts.chart('container', {
        series: [
            {
                id: 's1',
                name: 'S1',
                data: [1, 2, 3]
            },
            {
                name: 'S2',
                id: 's2',
                data: [1.5, 2.5, 3.5]
            }
        ]
    });

    assert.deepEqual(
        chart.series.map(s => s.name),
        ['S1', 'S2'],
        'Initial series names'
    );

    chart.update(
        {
            series: [
                {
                    name: 'S2',
                    id: 's2',
                    data: [1.5, 2.5, 3.5]
                },
                {
                    id: 's3',
                    name: 'S3',
                    data: [3, 2, 1]
                }
            ]
        },
        true,
        true
    );

    assert.deepEqual(
        chart.series.map(s => s.name),
        ['S2', 'S3'],
        'Updating with ids, cleanly update and replace (#13541)'
    );
});

QUnit.test('Axis update', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [1, 2, 3, 4]
            }
        ]
    });

    chart.update(
        {
            xAxis: [
                {
                    id: 'one'
                },
                {
                    id: 'two'
                }
            ]
        },
        true,
        true
    );

    assert.strictEqual(chart.xAxis.length, 2, 'Two axes now');

    chart.update(
        {
            xAxis: [
                {
                    id: 'two'
                }
            ]
        },
        true,
        true
    );

    assert.strictEqual(chart.xAxis[0].options.id, 'two', 'One left now');
});
