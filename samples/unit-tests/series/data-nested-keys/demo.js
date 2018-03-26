
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


QUnit.test('Nested properties in CSV', function (assert) {
    var data = 'Name,Value,Labels,Color,Test1,Test2\n' +
                'Bob,1,1,"#ff0000",Hello,12\n' +
                'Frank,1,0,red,0.45,Testing string\n',
        chart = Highcharts.chart('container', {
            data: {
                csv: data,
                seriesMapping: [{
                    'dataLabels.enabled': 2,
                    'dataLabels.color': 3,
                    'test.test2.test3.test4': 4,
                    'test.test2.test3.test5': 5
                }]
            },
            series: [{
                dataLabels: {
                    enabled: true
                },
                type: 'pie'
            }]
        }),
        points = chart.series[0].points;

    assert.ok(
        points[0].name === 'Bob' &&
        points[0].y === 1 &&
        points[0].options.dataLabels.enabled &&
        points[0].options.dataLabels.color === '#ff0000' &&
        points[0].options.test.test2.test3.test4 === 'Hello' &&
        points[0].options.test.test2.test3.test5 === 12,
        'Point 1 has correct options'
    );

    assert.ok(
        points[1].name === 'Frank' &&
        points[1].y === 1 &&
        !points[1].options.dataLabels.enabled &&
        points[1].options.dataLabels.color === 'red' &&
        points[1].options.test.test2.test3.test4 === 0.45 &&
        points[1].options.test.test2.test3.test5 === 'Testing string',
        'Point 2 has correct options'
    );
});


QUnit.test('Nested properties in maps', function (assert) {
    var chart = Highcharts.mapChart('container', {
            series: [{
                dataLabels: {
                    enabled: true
                },
                mapData: [{
                    name: 'Bob',
                    path: 'M0,0L10,0L10,10z'
                }, {
                    name: 'Frank',
                    path: 'M-10,-10L-20,-10L-20,-20z'
                }],
                joinBy: 'name',
                keys: [
                    'name',
                    'value',
                    'dataLabels.enabled',
                    'test.test2.test3.test4'
                ],
                data: [
                    ['Frank', 1],
                    ['Bob', 2, 0, 'Test string']
                ]
            }]
        }),
        points = chart.series[0].points;

    assert.ok(
        points[0].name === 'Frank' &&
        points[0].value === 1 &&
        points[0].dataLabel &&
        !points[0].options.test,
        'Point 1 has correct options'
    );

    assert.ok(
        points[1].name === 'Bob' &&
        points[1].value === 2 &&
        !points[1].options.dataLabels.enabled &&
        points[1].options.test.test2.test3.test4 === 'Test string',
        'Point 2 has correct options'
    );
});


