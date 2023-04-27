QUnit.test('Positioning labels according to real points', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [
                        { y: 1, id: 'id1' },
                        { y: 1, id: 'id2' },
                        { y: 3, id: 'id3' },
                        { y: 4, id: 'id4' },
                        { y: 5, id: 'id5' }
                    ]
                }
            ],

            annotations: [
                {
                    labels: [
                        {
                            point: 'id1',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 0,
                            y: 0
                        },
                        {
                            point: 'id2',
                            align: 'left',
                            verticalAlign: 'top',
                            x: 20,
                            y: -20
                        },
                        {
                            point: 'id3',
                            distance: 20
                        },
                        {
                            point: 'id4',
                            positioner: function () {
                                return {
                                    x: 0,
                                    y: 0
                                };
                            }
                        },
                        {
                            point: 'id5',
                            text: 'Really long label',
                            x: -10
                        }
                    ],

                    labelOptions: {
                        allowOverlap: true
                    }
                }
            ]
        }),
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];

    var p1 = chart.series[0].data[0],
        x1 = xAxis.toPixels(p1.x),
        y1 = yAxis.toPixels(p1.y),
        label1 = chart.annotations[0].labels[0].graphic;

    assert.strictEqual(
        Math.round(label1.x),
        Math.round(x1),
        'x position - left aligned with no offset'
    );
    assert.strictEqual(
        Math.round(label1.y),
        Math.round(y1),
        'y position - top aligned with no offset'
    );

    var p2 = chart.series[0].data[1],
        x2 = Math.round(xAxis.toPixels(p2.x) + 20),
        y2 = Math.round(yAxis.toPixels(p2.y) - 20),
        label2 = chart.annotations[0].labels[1].graphic;

    assert.strictEqual(
        Math.round(label2.x),
        x2,
        'x position - left aligned with x offset'
    );
    assert.strictEqual(
        Math.round(label2.y),
        y2,
        'y position - top aligned with y offset'
    );

    var p3 = chart.series[0].data[2],
        label3 = chart.annotations[0].labels[2].graphic,
        x3 = Math.round(xAxis.toPixels(p3.x) - Math.round(label3.width / 2)),
        y3 = Math.round(yAxis.toPixels(p3.y) - label3.height - 20);

    assert.close(Math.round(label3.x), x3, 2, 'x position - distance');
    assert.close(Math.round(label3.y), y3, 1, 'y position - distance');

    var label4 = chart.annotations[0].labels[3].graphic,
        x4 = 0,
        y4 = 0;

    assert.strictEqual(label4.x, x4, 'x position - positioner');
    assert.strictEqual(label4.y, y4, 'y position - positioner');

    const label5 = chart.annotations[0].labels[4].graphic;

    assert.ok(
        Math.round(label5.x + label5.width) <= chart.plotLeft + chart.plotWidth,
        '#15524: Label should be within the plot'
    );
});

QUnit.test(
    'Positioning labels according to real points - inverted chart',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    inverted: true
                },

                series: [
                    {
                        data: [
                            { y: 1, id: 'id1' },
                            { y: 1, id: 'id2' },
                            { y: 3, id: 'id3' },
                            { y: 4, id: 'id4' },
                            { y: 5, id: 'id5' }
                        ]
                    }
                ],

                annotations: [
                    {
                        labels: [
                            {
                                point: 'id1',
                                align: 'left',
                                verticalAlign: 'top',
                                x: 0,
                                y: 0
                            },
                            {
                                point: 'id2',
                                align: 'left',
                                verticalAlign: 'top',
                                x: 20,
                                y: -20
                            },
                            {
                                point: 'id3',
                                distance: 20
                            },
                            {
                                point: 'id4',
                                positioner: function () {
                                    return {
                                        x: 20,
                                        y: 20
                                    };
                                }
                            }
                        ],

                        labelOptions: {
                            allowOverlap: true
                        }
                    }
                ]
            }),
            xAxis = chart.xAxis[0],
            yAxis = chart.yAxis[0];

        var p1 = chart.series[0].data[0],
            x1 = yAxis.toPixels(p1.y),
            y1 = xAxis.toPixels(p1.x),
            label1 = chart.annotations[0].labels[0].graphic;

        assert.strictEqual(
            Math.round(label1.x),
            Math.round(x1),
            'x position - left aligned with no offset'
        );
        assert.strictEqual(
            Math.round(label1.y),
            Math.round(y1),
            'y position - top aligned with no offset'
        );

        var p2 = chart.series[0].data[1],
            x2 = Math.round(yAxis.toPixels(p2.y) + 20),
            y2 = Math.round(xAxis.toPixels(p2.x) - 20),
            label2 = chart.annotations[0].labels[1].graphic;

        assert.strictEqual(
            Math.round(label2.x),
            x2,
            'x position - left aligned with x offset'
        );
        assert.strictEqual(
            Math.round(label2.y),
            y2,
            'y position - top aligned with y offset'
        );

        var p3 = chart.series[0].data[2],
            label3 = chart.annotations[0].labels[2].graphic,
            x3 = Math.round(yAxis.toPixels(p3.y) + 20),
            y3 = Math.round(
                Math.round(xAxis.toPixels(p3.x)) - label3.height / 2
            );

        assert.strictEqual(Math.round(label3.x), x3, 'x position - distance');
        assert.strictEqual(Math.round(label3.y), y3, 'y position - distance');

        var label4 = chart.annotations[0].labels[3].graphic,
            x4 = 20,
            y4 = 20;

        assert.strictEqual(label4.x, x4, 'x position - positioner');
        assert.strictEqual(label4.y, y4, 'y position - positioner');

        chart.destroy();
    }
);

QUnit.test('Positioning labels according to mock points', function (assert) {
    var p1 = {
            x: 2,
            y: 2.5,
            xAxis: 0,
            yAxis: 0
        },
        p2 = {
            x: 1,
            y: 50,
            xAxis: 0
        },
        p3 = {
            x: 85,
            y: 100
        },
        chart = Highcharts.chart('container', {
            series: [
                {
                    data: [
                        { y: 1, id: 'id1' },
                        { y: 1, id: 'id2' },
                        { y: 3, id: 'id3' },
                        { y: 4, id: 'id4' },
                        { y: 5, id: 'id5' }
                    ]
                }
            ],

            annotations: [
                {
                    labels: [
                        {
                            point: p1,
                            align: 'right',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0
                        },
                        {
                            point: p2,
                            align: 'center',
                            verticalAlign: 'middle',
                            x: 5,
                            y: -20
                        },
                        {
                            point: p3,
                            distance: 20,
                            format: '{point.plotX}, {point.plotY}'
                        },
                        {
                            point: 'id4',
                            positioner: function () {
                                return {
                                    x: 50,
                                    y: 80
                                };
                            }
                        }
                    ],

                    labelOptions: {
                        allowOverlap: true
                    }
                }
            ]
        }),
        xAxis = chart.xAxis[0],
        yAxis = chart.yAxis[0];

    var label1 = chart.annotations[0].labels[0].graphic,
        x1 = Math.round(xAxis.toPixels(p1.x) - label1.width),
        y1 = Math.round(yAxis.toPixels(p1.y) - label1.height);

    assert.strictEqual(
        Math.round(label1.x),
        x1,
        'x position - right aligned with no offset'
    );
    assert.strictEqual(
        Math.round(label1.y),
        y1,
        'y position - bottom aligned with no offset'
    );

    var label2 = chart.annotations[0].labels[1].graphic,
        x2 = Math.round(xAxis.toPixels(p2.x) - label2.width / 2 + 5),
        y2 = Math.round(chart.plotTop + p2.y - label2.height / 2 - 20);

    assert.strictEqual(
        Math.round(label2.x),
        x2,
        'x position - center aligned with offset'
    );
    assert.strictEqual(
        Math.round(label2.y),
        y2,
        'y position - middle aligned with offset'
    );

    var label3 = chart.annotations[0].labels[2].graphic,
        x3 = Math.round(chart.plotLeft + p3.x - label3.width / 2),
        y3 = Math.round(chart.plotTop + p3.y - label3.height - 20);

    assert.strictEqual(Math.round(label3.x), x3, 'x position - distance');
    assert.strictEqual(Math.round(label3.y), y3, 'y position - distance');

    var label4 = chart.annotations[0].labels[3].graphic,
        x4 = 50,
        y4 = 80;

    assert.strictEqual(Math.round(label4.x), x4, 'x position - positioner');
    assert.strictEqual(Math.round(label4.y), y4, 'y position - positioner');
});

QUnit.test(
    'Positioning labels according to mock points - inverted chart',
    function (assert) {
        var p1 = {
                x: 2,
                y: 2.5,
                xAxis: 0,
                yAxis: 0
            },
            p2 = {
                x: 1,
                y: 50,
                xAxis: 0
            },
            p3 = {
                x: 85,
                y: 100
            },
            chart = Highcharts.chart('container', {
                chart: {
                    inverted: true
                },

                series: [
                    {
                        data: [
                            { y: 1, id: 'id1' },
                            { y: 1, id: 'id2' },
                            { y: 3, id: 'id3' },
                            { y: 4, id: 'id4' },
                            { y: 5, id: 'id5' }
                        ]
                    }
                ],

                annotations: [
                    {
                        labels: [
                            {
                                point: p1,
                                align: 'right',
                                verticalAlign: 'bottom',
                                x: 0,
                                y: 0
                            },
                            {
                                point: p2,
                                align: 'center',
                                verticalAlign: 'middle',
                                x: 5,
                                y: -20,
                                format: '{point.x}, {point.plotY}'
                            },
                            {
                                point: p3,
                                distance: 20,
                                format: '{point.plotX}, {point.plotY}'
                            },
                            {
                                point: 'id4',
                                positioner: function () {
                                    return {
                                        x: 200,
                                        y: 250
                                    };
                                }
                            }
                        ],

                        labelOptions: {
                            allowOverlap: true
                        }
                    }
                ]
            }),
            xAxis = chart.xAxis[0],
            yAxis = chart.yAxis[0];

        var label1 = chart.annotations[0].labels[0].graphic,
            x1 = Math.round(yAxis.toPixels(p1.y) - label1.width),
            y1 = Math.round(xAxis.toPixels(p1.x) - label1.height);

        assert.strictEqual(
            Math.round(label1.x),
            x1,
            'x position - right aligned with no offset'
        );
        assert.strictEqual(
            Math.round(label1.y),
            y1,
            'y position - bottom aligned with no offset'
        );

        var label2 = chart.annotations[0].labels[1].graphic,
            x2 = Math.round(chart.plotLeft + p2.y - label2.width / 2 + 5),
            y2 = Math.round(xAxis.toPixels(p2.x) - label2.height / 2 - 20);

        assert.strictEqual(
            Math.round(label2.x),
            x2,
            'x position - center aligned with offset'
        );
        assert.strictEqual(
            Math.round(label2.y),
            y2,
            'y position - middle aligned with offset'
        );

        var label3 = chart.annotations[0].labels[2].graphic,
            x3 = Math.round(chart.plotLeft + p3.y + 20),
            y3 = Math.round(chart.plotTop + p3.x - label3.height / 2);

        assert.strictEqual(Math.round(label3.x), x3, 'x position - distance');
        assert.strictEqual(Math.round(label3.y), y3, 'y position - distance');

        var label4 = chart.annotations[0].labels[3].graphic,
            x4 = 200,
            y4 = 250;

        assert.strictEqual(Math.round(label4.x), x4, 'x position - positioner');
        assert.strictEqual(Math.round(label4.y), y4, 'y position - positioner');
    }
);

QUnit.test(
    'Visibility of labels - point.isInsidePlot() - polar chart',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    polar: true
                },

                annotations: [
                    {
                        labels: [
                            {
                                point: 'id1'
                            },
                            {
                                point: 'id2'
                            },
                            {
                                point: 'id3'
                            },
                            {
                                point: 'id4'
                            },
                            {
                                point: 'id5'
                            },
                            {
                                point: 'id6'
                            }
                        ]
                    }
                ],

                yAxis: {
                    max: 10,
                    labels: {
                        enabled: false
                    }
                },

                series: [
                    {
                        data: [
                            { y: 3, id: 'id1' },
                            { y: 4, id: 'id2' },
                            { y: 3, id: 'id3' },
                            { y: 4, id: 'id4' },
                            { y: 5, id: 'id5' },
                            { y: 12, id: 'id6' }
                        ]
                    }
                ]
            }),
            annotations = chart.annotations[0],
            points = chart.series[0].points;

        assert.strictEqual(
            points[5].isInside,
            false,
            'Point should not be displayed - (out of plot area)'
        );

        for (var i = 0; i < annotations.labels.length - 1; i++) {
            assert.strictEqual(
                points[i].isInside,
                true,
                'All labels inside plot area should be displayed'
            );
            assert.notStrictEqual(
                annotations.labels[i].graphic.y,
                annotations.labels[5].graphic.y,
                'All labels inside plot area should be displayed'
            );
        }
    }
);

QUnit.test(
    'Positioning labels according to real points for half of the yAxis height #13956',
    function (assert) {
        var chart = Highcharts.chart('container', {
                yAxis: [
                    {
                        top: '50%',
                        height: '50%'
                    }
                ],
                xAxis: [
                    {
                        left: '50%',
                        width: '50%'
                    }
                ],
                series: [
                    {
                        data: [
                            2,
                            11,
                            60,
                            {
                                y: 44,
                                id: 'pointII'
                            },
                            44
                        ]
                    }
                ],

                annotations: [
                    {
                        labels: [
                            {
                                point: 'pointII',
                                y: 0
                            }
                        ]
                    }
                ]
            }),
            xAxis = chart.xAxis[0],
            yAxis = chart.yAxis[0],
            point = chart.series[0].points[3],
            label = chart.annotations[0].labels[0].graphic,
            y = yAxis.toPixels(point.y),
            x = xAxis.toPixels(point.x);

        assert.strictEqual(
            Math.round(label.x + label.width / 2),
            Math.round(x),
            'x position'
        );
        assert.close(
            Math.round(label.y + label.height),
            Math.round(y),
            1,
            'y position'
        );
    }
);
