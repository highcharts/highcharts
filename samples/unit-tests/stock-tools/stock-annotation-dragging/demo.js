QUnit.test('Dragging annotation', function (assert) {
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

    const annotation = chart.addAnnotation(
        {
            langKey: 'arrowSegment',
            type: 'crookedLine',
            typeOptions: {
                line: { markerEnd: 'arrow', strokeWidth: 4 },
                xAxis: 0,
                yAxis: 0,
                points: [{
                    x: 4,
                    y: 1
                }, {
                    x: 4,
                    y: 3
                }]
            },
            animation: { defer: 0 }
        }
    );


    const originalPlotX = annotation.points[0].plotX;
    const testController = new TestController(chart);
    const diff = 25;
    const start = chart.plotLeft + originalPlotX;
    testController.pan([start, 200], [diff + start, 200]);
    const newPlotX = annotation.points[0].plotX;
    assert.close(
        originalPlotX + diff,
        newPlotX,
        1,
        `Annotation moved by ${diff} pixels`);
});
