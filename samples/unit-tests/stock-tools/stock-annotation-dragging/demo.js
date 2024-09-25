QUnit.test('Dragging annotation', assert => {
    const data = [];
    for (let i = 0; i < 300; i++) {
        if (i > 100 && i < 200) {
            continue;
        }
        data.push([
            i,
            Math.sin(i / 10),
            Math.sin(i / 10) + 1,
            Math.sin(i / 10),
            Math.sin(i / 10) + 1
        ]);
    }
    const chart = Highcharts.stockChart('container', {
        annotations: [
            {
                langKey: 'arrowSegment',
                type: 'crookedLine',
                typeOptions: {
                    line: { markerEnd: 'arrow', strokeWidth: 4 },
                    xAxis: 0,
                    yAxis: 0,
                    points: [
                        {
                            x: 4,
                            y: 1
                        },
                        {
                            x: 4,
                            y: 3
                        }
                    ]
                },
                animation: { defer: 0 }
            }
        ],
        scrollbar: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        chart: {
            width: 1000,
            height: 600
        },
        series: [
            {
                type: 'candlestick',
                data: data,
                dataGrouping: {
                    enabled: true
                }
            }
        ]
    });

    const annotation = chart.annotations[0];

    const diff = 25;
    const testController = new TestController(chart);
    const originalPlotX = annotation.points[0].plotX;
    const start = chart.plotLeft + originalPlotX;
    testController.pan([start, 200], [diff + start, 200], {}, true);
    const newPlotX = annotation.points[0].plotX;
    assert.close(
        originalPlotX + diff,
        newPlotX,
        1,
        `Annotation moved by ${diff} pixels`
    );
});

QUnit.test(
    'Dragging annotation in ordinal if one series is invisible',
    assert => {
        const chart = Highcharts.stockChart('container', {
            xAxis: {
                min: 3000,
                max: 3360
            },
            annotations: [
                {
                    draggable: 'x',
                    animation: {
                        defer: 0
                    },
                    shapes: [
                        {
                            strokeWidth: 3,
                            type: 'path',

                            points: [
                                {
                                    x: 3042,
                                    y: 0,
                                    xAxis: 0,
                                    yAxis: 0
                                },
                                {
                                    x: 3042,
                                    y: 1.2,
                                    xAxis: 0,
                                    yAxis: 0
                                }
                            ]
                        }
                    ]
                }
            ],

            series: [
                {
                    data: [
                        [2280, 0.5],
                        [2376, 0.54],
                        [2580, 0.51],
                        [2640, 0.55],
                        [3000, 0.95],
                        [3042, 0.96],
                        [3360, 1]
                    ]
                },
                {
                    data: [
                        [2280, 0.6],
                        [2376, 0.64],
                        [2580, 0.61],
                        [2640, 0.7],
                        [3000, 1],
                        [3042, 0.97],
                        [3360, 1]
                    ],

                    visible: false
                }
            ]
        });

        const offset = 60;

        const min = 3000 - offset;
        const max = 3360 - offset;
        chart.xAxis[0].setExtremes(min, max);

        const annotation = chart.annotations[0];

        const diff = 30;
        const testController = new TestController(chart);
        const originalPlotX = annotation.shapes[0].points[0].plotX;
        const start = chart.plotLeft + originalPlotX;
        testController.pan([start, 200], [diff + start, 200]);
        const newPlotX = annotation.shapes[0].points[0].plotX;
        assert.close(
            originalPlotX + diff,
            newPlotX,
            1,
            `Annotation moved by ${diff} pixels`
        );
    }
);
