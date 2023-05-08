QUnit.test('Annotation\'s dynamic methods', function (assert) {
    var labelCollector;
    var chart = Highcharts.chart(
        'container',
        {
            chart: {
                events: {
                    load: function () {
                        labelCollector = this.annotations[0].labelCollector;
                    }
                }
            },

            series: [
                {
                    data: [
                        43934,
                        52503,
                        57177,
                        69658,
                        97031,
                        119931,
                        137133,
                        154175
                    ]
                }
            ],

            annotations: [
                {
                    id: '1',
                    labels: [
                        {
                            point: {
                                x: 2,
                                y: 100000,
                                xAxis: 0,
                                yAxis: 0
                            }
                        }
                    ]
                }
            ]
        },
        function (chart) {
            var annotation = chart.addAnnotation({});

            assert.ok(
                true,
                'No errors after adding an annotation in callback (#10628).'
            );

            chart.removeAnnotation(annotation);
        }
    );

    assert.strictEqual(
        chart.options.annotations.length,
        1,
        'Annotation options are correctly added to chart options'
    );

    chart.annotations[0].labels[0].update({});
    chart.annotations[0].labels[0].translate(0, 0);

    assert.ok('#15524: Translating updated label should not throw');

    chart.removeAnnotation('1');

    assert.strictEqual(
        chart.labelCollectors.indexOf(labelCollector),
        -1,
        'Annotation label collector is not kept in the chart\'s label collectors (#7677).'
    );

    assert.strictEqual(
        chart.options.annotations.length,
        0,
        'Annotation options from the chart options are erased when the annotation is removed (#8393).'
    );

    var secondAnnotationOptions = {
        id: 2,
        labels: [
            {
                point: {
                    x: 3,
                    y: 125000,
                    xAxis: 0,
                    yAxis: 0
                }
            }
        ]
    };

    var secondAnnotation = chart.addAnnotation(secondAnnotationOptions);

    var thirdAnnotationOptions = {
        id: '3',
        labels: [
            {
                point: {
                    x: 4,
                    y: 125000,
                    xAxis: 0,
                    yAxis: 0
                }
            }, {
                point: {
                    x: 3,
                    y: 125000,
                    xAxis: 0,
                    yAxis: 0
                }
            }
        ]
    };

    var thirdAnnotation = chart.addAnnotation(thirdAnnotationOptions);

    assert.ok(
        chart.options.annotations[0] === secondAnnotation.options &&
            chart.options.annotations[1] === thirdAnnotation.options &&
            chart.options.annotations.length === 2,
        'Annotation options from the chart options are added when the annotations are added (#8393).'
    );

    thirdAnnotation.update({
        labelOptions: {
            format: 'custom format',
            backgroundColor: 'red'
        }
    });

    assert.strictEqual(
        thirdAnnotation.labels[0].options.format,
        'custom format',
        'Correct annotations text after update (annotations.labels)'
    );
    assert.strictEqual(
        thirdAnnotation.labels.length,
        2,
        '#16011: Labels should not disappear on update'
    );

    thirdAnnotation.update({
        labelOptions: {
            backgroundColor: 'green'
        }
    });

    assert.strictEqual(
        thirdAnnotation.labels[0].graphic.attr('fill'),
        'green',
        'Correct annotations label fill after update (annotations.labels)'
    );

    var annotation = chart.addAnnotation({
        shapes: [
            {
                type: 'circle',
                point: {
                    x: 4,
                    y: 123000,
                    xAxis: 0,
                    yAxis: 0
                },
                r: 5
            }
        ]
    });

    annotation.update({
        shapes: [
            {
                r: 25
            }
        ]
    });

    assert.strictEqual(
        annotation.shapes[0].graphic.attr('r'),
        25,
        'Correct annotation size after update (annotations.shapes)'
    );

    chart.removeAnnotation(2);

    assert.strictEqual(
        chart.annotations.length,
        2,
        'Annotation with id=number, should be removed without errors (#10648)'
    );

    const fib = chart.addAnnotation({
        type: 'fibonacci',
        typeOptions: {
            lineColor: 'blue',
            lineColors: ['blue', 'green', 'red'],
            points: [{}, {}]
        }
    });

    assert.strictEqual(
        fib.shapes[0].graphic.attr('stroke'),
        'blue',
        '#15424: First line should be blue (lineColors[0])'
    );
    assert.strictEqual(
        fib.shapes[3].graphic.attr('stroke'),
        'red',
        '#15424: Third line should be red (lineColors[2])'
    );
    assert.strictEqual(
        fib.shapes[5].graphic.attr('stroke'),
        'blue',
        '#15424: Fourth line should be blue (lineColor)'
    );

    const rect = chart.addAnnotation({
        shapes: [{
            type: 'path',
            points: [
                { xAxis: 0, yAxis: 0, x: 1, y: 150000 },
                { xAxis: 0, yAxis: 0, x: 3, y: 150000 },
                { xAxis: 0, yAxis: 0, x: 3, y: 100000 },
                { xAxis: 0, yAxis: 0, x: 1, y: 100000 }
            ]
        }, {
            type: 'path',
            points: [
                { xAxis: 0, yAxis: 0, x: 1, y: 150000 },
                { xAxis: 0, yAxis: 0, x: 3, y: 150000 },
                { xAxis: 0, yAxis: 0, x: 3, y: 100000 },
                { xAxis: 0, yAxis: 0, x: 1, y: 100000 }
            ]
        }]
    });

    assert.ok(
        rect.clipRect,
        '#15726: Rectangle annotations should be clipped'
    );

    assert.ok(
        thirdAnnotation.labels[0].graphic.hasClass('highcharts-no-tooltip'),
        '#14403: Annotation label should have no-tooltip class'
    );

    rect.update({});

    assert.strictEqual(
        rect.shapes.length,
        2,
        '#16011: Shapes should not disappear on update'
    );
});

QUnit.test(
    'Hiding and showing annotations with linked points',
    function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    showInLegend: true,
                    data: [
                        {
                            id: 'point1',
                            visible: false,
                            y: 3
                        },
                        {
                            y: 3
                        }
                    ],
                    type: 'pie'
                }
            ],
            annotations: [
                {
                    labels: [
                        {
                            point: 'point1',
                            text: 'Annotation'
                        }
                    ]
                }
            ]
        });

        assert.strictEqual(
            chart.annotations[0].labels[0].graphic.visibility,
            'hidden',
            'Annotation correctly hidden.'
        );
    }
);

QUnit.test('Annotation\'s update methods', function (assert) {
    var clock = TestUtilities.lolexInstall();

    try {
        var done = assert.async(),
            chart = Highcharts.chart('container', {
                annotations: [
                    {
                        labels: [
                            {
                                point: {
                                    xAxis: 0,
                                    yAxis: 0,
                                    x: 0,
                                    y: 5
                                }
                            }
                        ]
                    }
                ],
                series: [
                    {
                        data: [4, 3, 7, 8]
                    }
                ]
            });

        chart.update(
            {
                annotations: [
                    {
                        labelOptions: {
                            format: 'Sample text'
                        }
                    }
                ],
                xAxis: {
                    title: 'Test'
                }
            },
            null,
            null,
            { duration: 500 }
        );

        setTimeout(function () {
            const x = chart.annotations[0].clipRect.attr('x'),
                y = chart.annotations[0].clipRect.attr('y'),
                width = chart.annotations[0].clipRect.attr('width'),
                height = chart.annotations[0].clipRect.attr('height');

            assert.equal(
                isNaN(+x) || isNaN(+y) || isNaN(+width) || isNaN(+height),
                false,
                'Annotation\'s clipRect cannot have a NaN for numerical attributes'
            );

            done();
        }, 250);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
