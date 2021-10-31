QUnit.test('zIndex. #10490', (assert) => {
    const unsortedData = [
        {
            sets: ['A', 'B'],
            value: 1
        },
        {
            sets: ['B', 'C', 'A'],
            value: 1
        },
        {
            sets: ['A'],
            value: 2
        },
        {
            sets: ['C'],
            value: 2
        },
        {
            sets: ['A', 'C'],
            value: 1
        },
        {
            sets: ['B', 'C'],
            value: 1
        },
        {
            sets: ['B'],
            value: 2
        }
    ];

    const {
        series: [{ points }]
    } = Highcharts.chart('container', {
        series: [
            {
                type: 'venn',
                data: unsortedData
            }
        ]
    });

    const mapOfIdToZIndex = points.reduce((map, point) => {
        map[point.sets.join()] = point.graphic.attr('zIndex');
        return map;
    }, {});

    assert.deepEqual(
        mapOfIdToZIndex,
        {
            A: 1,
            B: 1,
            C: 1,
            'A,B': 2,
            'A,C': 2,
            'B,C': 2,
            'A,B,C': 3
        },
        'should order the point graphics by its number of sets in the relation'
    );
});

QUnit.module('Options', () => {
    QUnit.test('states[<state>].halo', (assert) => {
        const chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'venn'
                }
            ]
        });
        const {
            series: [series]
        } = chart;
        const states = ['hover', 'inactive', 'normal', 'select'];
        let { userOptions, options } = series;

        // Test default behaviour
        states.forEach((state) => {
            assert.strictEqual(
                options.states[state].halo,
                false,
                `Should have states.${state}.halo equal false by default.`
            );
        });

        // Update the series options
        const halo = { size: 20 };
        const statesOptions = states.reduce((obj, key) => {
            obj[key] = { halo };
            return obj;
        }, {});
        series.update({ states: statesOptions });
        ({ userOptions, options } = series);

        states.forEach((state) => {
            assert.strictEqual(
                typeof userOptions.states[state].halo,
                'object',
                `Should have userOptions.states.${state}.halo type of "object".`
            );
        });
        states.forEach((state) => {
            assert.strictEqual(
                options.states[state].halo,
                false,
                `Should have options.states.${state}.halo ignore userOptions and
                    equal false.`
            );
        });
    });
});

QUnit.test(
    'The inactive state should be set to the patterns the same as for colors, #14372.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'venn',
                    data: [
                        {
                            sets: ['A'],
                            value: 2
                        },
                        {
                            sets: ['B'],
                            value: 2
                        },
                        {
                            sets: ['A', 'B'],
                            value: 1,
                            name: 'A&B',
                            color: {
                                pattern: {
                                    path: {
                                        d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
                                        strokeWidth: 3
                                    },
                                    width: 10,
                                    height: 10
                                }
                            }
                        }
                    ]
                }
            ]
        });

        assert.ok(
            chart.series[0].points[0].graphic.attr('class'),
            '#15009: CSS class should be set'
        );

        assert.strictEqual(
            chart.series[0].points[2].graphic.opacity,
            0.75,
            'In normal state the pattern opacity should be equal to 0.75.'
        );
        chart.series[0].points[2].setState('inactive');

        assert.strictEqual(
            chart.series[0].points[2].graphic.opacity,
            0.075,
            'In inactive state the pattern opacity should be equal to 0.075.'
        );
        chart.series[0].points[2].setState('hover');

        assert.strictEqual(
            chart.series[0].points[2].graphic.opacity,
            1,
            'In hover state the pattern opacity should be equal to 1.'
        );
    }
);
