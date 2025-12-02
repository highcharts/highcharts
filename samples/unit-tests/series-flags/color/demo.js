QUnit.test(
    'Flags should get fill color from point options in a first place (#5978).',
    function (assert) {
        var color = '#ff0000',
            chart = Highcharts.stockChart('container', {
                series: [
                    {
                        data: [10, 20, 30]
                    },
                    {
                        type: 'flags',
                        data: [
                            {
                                x: 1,
                                title: 'F',
                                text: 'FlagText',
                                fillColor: color,
                                color: '#0000ff'
                            }
                        ]
                    }
                ]
            });

        assert.strictEqual(
            chart.series[1].points[0].graphic.box.attr('fill'),
            color,
            'Correct color for a fill'
        );
    }
);


QUnit.test(
    'Custom className should be correctly added to the flag (#21263).',
    assert => {
        const chart = Highcharts.stockChart('container', {
            series: [
                {
                    data: [10, 20, 30]
                },
                {
                    type: 'flags',
                    data: [
                        {
                            x: 1,
                            title: 'F',
                            text: 'FlagText',
                            className: 'custom-flag'
                        }
                    ]
                }
            ]
        });

        assert.strictEqual(
            chart.series[1].points[0].getClassName().split(' ')[2],
            'custom-flag',
            'Correct className is applied to the flag point.'
        );
    }
);
