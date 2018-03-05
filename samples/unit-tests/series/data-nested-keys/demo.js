
QUnit.test('Nested properties in series.keys', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                dataLabels: {
                    enabled: true
                },
                type: 'pie',
                keys: [
                    'y',
                    'dataLabels.enabled',
                    'dataLabels.color',
                    'test.test2.test3.test4',
                    'test.test2.test5.test6',
                    'test.test2.test5.test7',
                    'test.test2.test5.test6.test8',
                    'test.test2.test5.test6.test9'
                ],
                data: [
                    1,
                    [1],
                    [1, true],
                    [1, true, '#ff0000'],
                    [1, false, null, 1],
                    [1, false, null, 2, 12],
                    [1, false, null, 3, 13, 23],
                    [1, false, null, 4, 14, 24, 34, 44]
                ]
            }]
        }),
        points = chart.series[0].points;

    assert.ok(
        points[0].y === 1 && points[0].options.y === 1,
        'Point 1 has correct y value'
    );

    assert.ok(
        points[1].y === 1 && points[1].options.y === 1,
        'Point 2 has correct y value'
    );

    assert.ok(
        points[2].options.dataLabels.enabled && points[2].dataLabel.element,
        'Point 3 has data label'
    );

    assert.ok(
        points[3].options.dataLabels.enabled &&
        points[3].options.dataLabels.color === '#ff0000' &&
        points[3].dataLabel.element,
        'Point 4 has data label'
    );

    assert.ok(
        !points[4].options.dataLabels.enabled &&
        !(points[4].dataLabel && points[4].dataLabel.element) &&
        points[4].options.test.test2.test3.test4 === 1 &&
        !points[4].options.test.test2.test5,
        'Point 5 has correct options'
    );

    assert.ok(
        points[5].options.test.test2.test3.test4 === 2 &&
        points[5].options.test.test2.test5.test6 === 12 &&
        !points[5].options.test.test2.test5.test7,
        'Point 6 has correct options'
    );

    assert.ok(
        points[6].options.test.test2.test3.test4 === 3 &&
        points[6].options.test.test2.test5.test6 === 13 &&
        points[6].options.test.test2.test5.test7 === 23,
        'Point 7 has correct options'
    );

    assert.ok(
        points[7].options.test.test2.test3.test4 === 4 &&
        typeof points[7].options.test.test2.test5.test6 === 'object' &&
        points[7].options.test.test2.test5.test7 === 24 &&
        points[7].options.test.test2.test5.test6.test8 === 34 &&
        points[7].options.test.test2.test5.test6.test9 === 44,
        'Point 8 has correct options'
    );
});
