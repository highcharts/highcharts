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
                min: 1718730000000,
                max: 1718733600000
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
                                    x: 1718730420000,
                                    y: 0,
                                    xAxis: 0,
                                    yAxis: 0
                                },
                                {
                                    x: 1718730420000,
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
                        [1718722800000, 0.5],
                        [1718723760000, 0.54],
                        [1718725800000, 0.51],
                        [1718726400000, 0.55],
                        [1718730000000, 0.95],
                        [1718730420000, 0.96],
                        [1718733600000, 1]
                    ]
                },
                {
                    data: [
                        [1718722800000, 0.6],
                        [1718723760000, 0.64],
                        [1718725800000, 0.61],
                        [1718726400000, 0.7],
                        [1718730000000, 1],
                        [1718730420000, 0.97],
                        [1718733600000, 1]
                    ],

                    visible: false
                }
            ]
        });

        const tenMinutes = 600 * 1000;

        const min = 1718730000000 - tenMinutes;
        const max = 1718733600000 - tenMinutes;
        chart.xAxis[0].setExtremes(min, max);

        const annotation = chart.annotations[0];

        const diff = 1;
        const testController = new TestController(chart);
        const originalPlotX = annotation.shapes[0].points[0].plotX;
        const start = chart.plotLeft + originalPlotX;
        testController.pan([start, 200], [diff + start, 200], {}, true);
        const newPlotX = annotation.shapes[0].points[0].plotX;
        assert.close(
            originalPlotX + diff,
            newPlotX,
            1,
            `Annotation moved by ${diff} pixels`
        );
    }
);
