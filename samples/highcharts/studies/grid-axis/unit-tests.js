/**
 * Tests the isOuterAxis() function
 */
QUnit.test('isOuterAxis()', function (assert) {
    var chart;

    $('#container').highcharts({
        chart: {
            type: 'bar'
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

/**
 * Compare numbers taking in account an error.
 * http://bumbu.me/comparing-numbers-approximately-in-qunitjs/
 *
 * @param  {Float} number
 * @param  {Float} expected
 * @param  {Float} error    Optional
 * @param  {String} message  Optional
 */
QUnit.assert.close = function (number, expected, error, message) {
    if (error === void 0 || error === null) {
        error = 0.00001; // default error
    }

    var result = number === expected || (number < expected + error && number > expected - error) || false;

    QUnit.push(result, number, expected, message);
};

/**
 * Tests the linear axis horizontal placement
 */
QUnit.test('Linear axis horizontal placement', function (assert) {
    var chart,
        axes = [],
        error;

    // Chart 1
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        yAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
            id: 'axis1'
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true,
            id: 'axis2'
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            opposite: true,
            linkedTo: 0,
            id: 'axis3'
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
            opposite: true,
            linkedTo: 1,
            id: 'axis4'
        }],
        series: [{
            data: [129.9, 271.5, 306.4, -29.2, 544.0, 376.0, 435.6, 348.5, 216.4, 294.1, 35.6, 354.4],
            yAxis: 0
        }, {
            data: [29.9, -71.5, -106.4, -129.2, -144.0, -176.0, -135.6, -148.5, -216.4, -194.1, -95.6, -54.4],
            yAxis: 1
        }]
    });

    chart = $('#container').highcharts();
    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        error,
        'Left outer linear axis horizontally placed correctly'
    );

    assert.close(
        axes[3].x,
        axes[2].x + axes[2].width,
        error,
        'Right outer linear axis horizontally placed correctly'
    );
});

/**
 * Tests the datetime axis horizontal placement
 */
QUnit.test('Datetime axis horizontal placement', function (assert) {
    var chart,
        axes = [],
        error;

    $('#container').highcharts({
        title: {
            type: 'scatter'
        },
        yAxis: [{
            title: {
                text: 'First Axis'
            },
            grid: true,
            id: 'axis1',
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '2em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }, {
            title: {
                text: 'Second Axis'
            },
            grid: true,
            id: 'axis2',
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            title: {
                text: 'Third Axis'
            },
            grid: true,
            id: 'axis3',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }, {
            title: {
                text: 'Fourth Axis'
            },
            grid: true,
            id: 'axis4',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            linkedTo: 0
        }],
        series: [{
            name: 'Project 3',
            borderRadius: 10,
            data: [{
                x: 7,
                x2: 9,
                y: Date.UTC(2014, 10, 19)
            }, {
                x: 7,
                x2: 12,
                y: Date.UTC(2014, 10, 20)
            }, {
                x: 12,
                x2: 13,
                y: Date.UTC(2014, 10, 21)
            }]
        }]
    });

    chart = $('#container').highcharts();
    axes[0] = chart.yAxis[0].axisGroup.getBBox();
    axes[1] = chart.yAxis[1].axisGroup.getBBox();
    axes[2] = chart.yAxis[2].axisGroup.getBBox();
    axes[3] = chart.yAxis[3].axisGroup.getBBox();

    error = 0.00001;

    assert.close(
        axes[1].x + axes[1].width,
        axes[0].x,
        error,
        'Left outer datetime axis horizontally placed correctly'
    );

    assert.close(
        axes[3].x,
        axes[2].x + axes[2].width,
        error,
        'Right outer datetime axis horizontally placed correctly'
    );
});
