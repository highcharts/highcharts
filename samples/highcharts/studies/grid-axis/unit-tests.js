/**
 * Tests the isOuterAxis() function
 */
QUnit.test('isOuterAxis()', function (assert) {
    var chart;

    $('#container').highcharts({
        chart: {
            alignThresholds: true,
            type: 'area'
        },
        xAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
            opposite: true
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            xAxis: 0
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
            xAxis: 1
        }, {
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            xAxis: 2
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
            xAxis: 3
        }]
    });

    chart = $('#container').highcharts();

    assert.equal(
        chart.xAxis[1].isOuterAxis(),
        true,
        'Lowermost bottom x-axis is outerAxis'
    );

    assert.notEqual(
        chart.xAxis[2].isOuterAxis(),
        true,
        'Lowermost top x-axis is not outerAxis'
    );

    assert.equal(
        chart.xAxis[3].isOuterAxis(),
        true,
        'Topmost top x-axis is outerAxis'
    );
});

/**
 * Tests the additions to Highcharts.dateFormats
 */
QUnit.test('dateFormats', function (assert) {
    assert.equal(
        typeof Highcharts.dateFormats.W,
        'function',
        'Weeks format exists'
    );

    assert.equal(
        typeof Highcharts.dateFormats.E,
        'function',
        'Single character week day format exists'
    );

    assert.equal(
        Highcharts.dateFormats.W(Date.UTC(2016, 8, 15)), // September 15th 2016
        37,
        'Week format produces correct output'
    );

    assert.equal(
        Highcharts.dateFormats.E(Date.UTC(2016, 8, 15)), // September 15th 2016
        'T',
        'Signle character week day format produces correct output'
    );
});
