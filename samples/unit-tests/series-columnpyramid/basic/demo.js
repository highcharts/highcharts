QUnit.test('Column pyramid series', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'columnpyramid',
            inverted: true
        },
        yAxis: {
            width: '40%'
        },
        series: [{
            data: [10, 20, 5]
        }]
    });

    assert.ok(
        chart.series[0].points[1].graphic.d &&
            chart.series[0].points[1].graphic !== 'rect',
        'Shapes are paths - pyramids'
    );

    const [, x1, y1] = chart.series[0].points[0].shapeArgs.d[0],
        [, x2, y2] = chart.series[0].points[0].shapeArgs.d[1];

    assert.close(
        x1,
        x2,
        0.5,
        `The pyramid shape should be correct (the point has always 4
        coordinates, 2 of them should be the same to get triangle), #16150.`
    );

    assert.close(
        y1,
        y2,
        0.5,
        `The pyramid shape should be correct (the point has always 4
        coordinates, 2 of them should be the same to get triangle), #16150.`
    );
});

QUnit.test('Column pyramid series - 0 dataLabel #12514', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'columnpyramid'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                data: [
                    ['Pyramid of Khufu', 138.8],
                    ['Pyramid of Khafre', 0],
                    ['Red Pyramid', 104]
                ]
            }
        ]
    });
    var testedLabel = chart.series[0].points[1].dataLabel;

    assert.strictEqual(
        Number.isNaN(testedLabel.alignAttr.x),
        false,
        'Label alignAttr.x should be a number #12514'
    );

    assert.strictEqual(
        testedLabel.translateY !== -9999,
        true,
        'Label should be translated and had different position translate attributes than starting values #12514'
    );
});