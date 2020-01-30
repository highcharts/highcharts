QUnit.test('Annotations defer option test #12584', function (assert) {
    var chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                animation: {
                    duration: 2000
                }
            }
        },

        series: [{
            data: [{
                y: 29.9,
                id: 'min'
            }, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, {
                y: 216.4,
                id: 'max'
            }, 194.1, 95.6, 54.4]
        }],

        annotations: [{
            defer: true, //duration value is inherited from plotOptions
            labels: [{
                point: 'max',
                text: 'Max'
            }]
        }, {
            defer: false,
            labels: [{
                point: 'min',
                text: 'Min'
            }]
        }, {
            defer: {
                duration: 1000
            },
            shapes: [{
                type: 'circle',
                point: {
                    x: 50,
                    y: 50
                },
                r: 10
            }]
        }]
    });

    assert.strictEqual(
        chart.annotations[0].defer.duration,
        chart.userOptions.plotOptions.series.animation.duration,
        'For this annotations the duration time should be the same as set in plotOptions.'
    );

    assert.strictEqual(
        chart.annotations[1].graphic.visibility,
        "visible",
        'Annotation should be render immediately.'
    );

    assert.strictEqual(
        chart.annotations[2].defer.duration,
        chart.annotations[2].options.defer.duration,
        'Duration time should be same as set in the options.'
    );
});