QUnit.test('Annotations defer option test #12901', function (assert) {
    var chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                animation: {
                    duration: 2000
                }
            }
        },

        series: [
            {
                data: [
                    {
                        y: 29.9,
                        id: 'min'
                    },
                    71.5,
                    106.4,
                    129.2,
                    144.0,
                    176.0,
                    135.6,
                    148.5,
                    {
                        y: 216.4,
                        id: 'max'
                    },
                    194.1,
                    95.6,
                    54.4
                ]
            }
        ],

        annotations: [
            {
                // animation object is not defined - defer value is inherited from series.animation
                labels: [
                    {
                        point: 'max',
                        text: 'Max'
                    }
                ]
            },
            {
                animation: {
                    defer: 0,
                    duration: 200
                },
                labels: [
                    {
                        point: 'min',
                        text: 'Min'
                    }
                ]
            },
            {
                animation: {
                    defer: 500,
                    duration: 200
                },
                shapes: [
                    {
                        type: 'circle',
                        point: {
                            x: 50,
                            y: 50
                        },
                        r: 10
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.annotations[0].animationConfig.defer,
        chart.userOptions.plotOptions.series.animation.duration - 500, // 500 is an animObject default value for duration
        'For this annotations the duration time should be the same as set in plotOptions.'
    );

    assert.strictEqual(
        chart.annotations[1].graphic.visibility,
        'inherit',
        'Annotation should be render immediately.'
    );

    assert.strictEqual(
        chart.annotations[2].animationConfig.defer,
        chart.annotations[2].options.animation.defer -
            chart.annotations[2].options.animation.duration,
        'Duration time should be same as set in the options.'
    );
});
