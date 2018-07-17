QUnit.test('Pane update, single', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: 'yellow'
            }
        },

        series: [{
            data: [100],
            animation: false
        }]

    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'yellow',
        'Initial background'
    );

    chart.pane[0].update({
        background: {
            backgroundColor: 'green'
        }
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'green',
        'New background'
    );

    chart.pane[0].update({
        startAngle: 0,
        endAngle: 360
    });
    assert.strictEqual(
        chart.yAxis[0].startAngleRad,
        -Math.PI / 2,
        'Value axis angle is updated'
    );

    // More background props, background array definition
    chart.pane[0].update({
        background: [{
            outerRadius: '152%',
            innerRadius: '88%',
            backgroundColor: 'red',
            borderWidth: 2,
            borderColor: 'blue'
        }]
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('stroke'),
        'blue',
        'New border color'
    );

    assert.strictEqual(
        chart.pane[0].background[0].attr('stroke-width'),
        2,
        'New border width'
    );

});

QUnit.test('Pane update through chart.update', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: [{
            center: ['25%', '50%'],
            background: {
                backgroundColor: 'yellow'
            }
        }, {
            center: ['75%', '50%'],
            background: {
                backgroundColor: 'blue'
            },
            id: 'second'
        }],

        yAxis: [{
            min: 0,
            max: 100,
            pane: 0
        }, {
            min: 0,
            max: 100,
            pane: 1
        }],

        series: [{
            data: [25],
            animation: false,
            yAxis: 0
        }, {
            data: [75],
            animation: false,
            yAxis: 1
        }]

    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'yellow',
        'Initial background'
    );

    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'blue',
        'Initial background'
    );

    chart.update({
        pane: {
            background: {
                backgroundColor: 'red'
            }
        }
    });

    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'red',
        'Single item updated, use first item'
    );

    chart.update({
        pane: [{
            background: {
                backgroundColor: 'purple'
            }
        }, {
            background: {
                backgroundColor: 'pink'
            }
        }]
    });
    assert.strictEqual(
        chart.pane[0].background[0].attr('fill'),
        'purple',
        'Parallel array updated'
    );
    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'pink',
        'Parallel array updated'
    );

    chart.update({
        pane: [{
            id: 'second',
            background: {
                backgroundColor: 'silver'
            }
        }]
    });

    assert.strictEqual(
        chart.pane[1].background[0].attr('fill'),
        'silver',
        'Pane updated by id'
    );

});

QUnit.test('Pane update, backgrounds', function (assert) {

    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            animation: false
        },

        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{
                backgroundColor: 'yellow',
                outerRadius: '100%'
            }, {
                backgroundColor: 'red',
                outerRadius: '90%'
            }, {
                backgroundColor: 'blue',
                outerRadius: '80%'
            }]
        },

        series: [{
            data: [100],
            animation: false
        }]

    });

    assert.strictEqual(
        chart.pane[0].background.length,
        3,
        '3 backgrounds initially'
    );

    chart.pane[0].update({
        background: [{
            backgroundColor: 'purple'
        }]
    });
    assert.strictEqual(
        chart.pane[0].background.length,
        1,
        '1 backgrounds after update'
    );

    chart.pane[0].update({
        background: [{
            backgroundColor: 'purple'
        }, {
            backgroundColor: 'pink',
            outerRadius: '80%'
        }]
    });
    assert.strictEqual(
        chart.pane[0].background.length,
        2,
        '2 backgrounds after update'
    );
});

QUnit.test('Pane responsiveness', function (assert) {
    var chart = Highcharts.chart('container', {

        chart: {
            type: 'gauge',
            height: '70%',
            width: 300
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: 'red',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        series: [{
            data: [50]
        }],

        yAxis: {
            min: 0,
            max: 100
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 350
                },
                chartOptions: {
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            }
                        }
                    },
                    yAxis: {
                        labels: {
                            enabled: false
                        }
                    },
                    pane: {
                        background: {
                            backgroundColor: "green"
                        }
                    }
                }
            }]
        }
    });

    assert.strictEqual(
        chart.container.querySelector('.highcharts-pane-group path')
            .getAttribute('fill'),
        'green',
        'Green background respected'
    );
});


QUnit.test(
    'Pane backgrounds, plot bands and chart updating (#3176)',
    function (assert) {
        var chart, options;

        function getOptions() {

            return {

                chart: {
                    type: 'gauge'
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(255, 255, 255, 0.5)'],
                                [1, 'rgba(96, 96, 96, 0.5)']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, 'rgba(255, 255, 255, 0.5)'],
                                [1, 'rgba(96, 96, 96, 0.5)']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: 'rgba(192, 192, 192, 0.5)',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: [{
                    min: 0,
                    max: 200

                }],

                series: [{
                    data: [80]
                }]

            };
        }

        chart = $('#container').highcharts(getOptions()).highcharts();

        assert.strictEqual(
            chart.pane[0].background.length,
            4,
            "No bands, four backgrounds initially"
        );

        // Run update
        chart.yAxis[0].update({
            min: 0,
            max: 400
        });

        assert.strictEqual(
            chart.pane[0].background.length,
            4,
            "No bands, four backgrounds after update"
        );


        // Add an initial plot band
        options = getOptions();
        options.yAxis[0].plotBands = [{
            from: 0,
            to: 80,
            color: 'green'
        }];
        chart = $('#container').highcharts(options).highcharts();

        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            1,
            "One band, four backgrounds initially"
        );
        assert.strictEqual(
            chart.pane[0].background.length,
            4,
            "One band, four backgrounds initially"
        );

        // Run update
        assert.strictEqual(
            chart.yAxis[0].plotLinesAndBands.length,
            1,
            "One band, four backgrounds initially"
        );
        assert.strictEqual(
            chart.pane[0].background.length,
            4,
            "One band, four backgrounds initially"
        );
    }
);
