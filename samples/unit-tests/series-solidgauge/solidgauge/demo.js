QUnit.test('tooltip', function (assert) {
    assert.strictEqual(
        Highcharts.Series.types.solidgauge.prototype.noSharedTooltip,
        true,
        'noSharedTooltip: true. #5354'
    );
});

QUnit.test('Solid gauge yAxis.update (#5895)', function (assert) {
    const gaugeOptions = {
        chart: {
            type: 'solidgauge',
            animation: false
        },

        title: null,

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0, '#00ff00'],
                [1, '#00ff00']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                },
                animation: false
            }
        }
    };

    // The speed gauge
    const chart = Highcharts.chart(
        'container',
        Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 200,
                title: {
                    text: 'Speed'
                }
            },

            credits: {
                enabled: false
            },

            series: [
                {
                    name: 'Speed',
                    data: [80]
                }
            ]
        })
    );

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(0,255,0)',
        'Initially green'
    );

    chart.yAxis[0].update(
        {
            stops: [
                [0, '#ff0000'], // red
                [1, '#ff0000'] // red
            ]
        },
        true
    );

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(255,0,0)',
        'Updated to red'
    );

    chart.yAxis[0].update(
        {
            stops: [
                [0, '#0000ff'],
                [1, '#0000ff']
            ]
        },
        true
    );

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(0,0,255)',
        'Updated again'
    );
});

QUnit.test('Solid gauge animated color', function (assert) {
    const clock = TestUtilities.lolexInstall();
    try {
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'solidgauge',
                    animation: {
                        duration: 50
                    }
                },

                title: null,

                tooltip: {
                    enabled: false
                },

                yAxis: {
                    stops: [
                        [0, '#000000'],
                        [1, '#ffffff']
                    ],
                    min: 0,
                    max: 100
                },

                series: [
                    {
                        name: 'Speed',
                        data: [10]
                    }
                ]
            }),
            point = chart.series[0].points[0];

        assert.strictEqual(
            Highcharts.color(point.graphic.element.getAttribute('fill')).get(),
            Highcharts.color('rgb(26,26,26)').get(),
            'Initial color'
        );

        point.update(50);
        TestUtilities.lolexRunAndUninstall(clock);

        assert.strictEqual(
            Highcharts.color(point.graphic.element.getAttribute('fill')).get(),
            Highcharts.color('rgb(128,128,128)').get(),
            'Updated color'
        );
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Solid gauge: legend', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'solidgauge'
        },
        series: [
            {
                showInLegend: true,
                colorByPoint: false,
                data: [10]
            }
        ]
    });

    assert.strictEqual(
        chart.legend.allItems[0].legendItem.symbol.element.getAttribute('fill'),
        chart.series[0].points[0].graphic.element.getAttribute('fill'),
        'Series legend item: color taken from series'
    );
});

QUnit.test('Solid gauge null point (#10630)', function (assert) {
    const chart = Highcharts.chart('container', {
        accessibility: {
            enabled: false
        },
        chart: {
            type: 'solidgauge'
        },
        series: [
            {
                data: [null]
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic,
        undefined,
        'Series legend item: color taken from series'
    );
});

QUnit.test('Solid gauge updates', function (assert) {
    const resetTo = Highcharts.defaultOptions.yAxis.labels.style.color,
        tickLength = 0,
        minorTickLength = 0,
        distance = 20;
    Highcharts.setOptions({
        yAxis: {
            tickLength,
            minorTickLength,
            labels: {
                distance,
                style: {
                    color: 'red'
                }
            }
        }
    });

    let chart = Highcharts.chart('container', {
        chart: {
            type: 'solidgauge'
        },

        yAxis: [{
            min: 0,
            max: 20
        }],

        series: [
            {
                name: 'Speed',
                data: [10]
            }
        ]
    });
    const point = chart.series[0].points[0],
        yAxis = chart.yAxis[0];

    assert.deepEqual(
        [
            yAxis.options.labels.style.color,
            yAxis.options.tickLength,
            yAxis.options.minorTickLength,
            yAxis.options.labels.distance
        ], [
            'red',
            tickLength,
            minorTickLength,
            distance
        ],
        `Axis options set by setOptions should overwrite defaults, #16112 and
        #20804.`
    );

    chart.series[0].update({
        linecap: 'round',
        borderWidth: 3,
        borderColor: 'red'
    });

    assert.strictEqual(
        point.graphic.element.getAttribute('stroke'),
        'red',
        'borderColor should be updated (#12445)'
    );
    assert.strictEqual(
        point.graphic.element.getAttribute('stroke-width'),
        '3',
        'borderWidth should be updated (#12445)'
    );
    assert.strictEqual(
        point.graphic.element.getAttribute('stroke-linecap'),
        'round',
        'linecap should be updated (#12445)'
    );

    assert.strictEqual(
        point.percentage,
        (point.y - yAxis.min) / (yAxis.max - yAxis.min) * 100,
        'percentage should be correctly calculated (#18448)'
    );

    // Reset
    Highcharts.defaultOptions.yAxis.labels.style.color = resetTo;

    chart = Highcharts.chart('container', {
        chart: {
            type: 'solidgauge'
        },
        yAxis: {
            min: 0,
            max: 100
        },
        series: [{
            rounded: false,
            animation: false,
            data: [{
                radius: '100%',
                innerRadius: 90,
                y: 100
            }]
        }, {
            rounded: true,
            animation: false,
            data: [{
                radius: '100%',
                innerRadius: 90,
                color: 'red',
                y: 100
            }]
        }]
    });

    assert.close(
        chart.series[0].points[0].graphic.getBBox().x,
        chart.series[1].points[0].graphic.getBBox().x,
        0.5,
        `Solid Gauge series set to 100% should looks the same for rounded and
        non-rounded gauge, #21429.`
    );
});
