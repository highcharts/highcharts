var defaultChartConfig;

QUnit.testStart(function () {
    defaultChartConfig = {
        chart: {
            type: 'gantt'
        },
        title: {
            text: 'Projects'
        },
        xAxis: [{
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1.5em'
                }
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}',
                style: {
                    fontSize: '1.5em'
                }
            },
            linkedTo: 0
        }],
        yAxis: [{
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            grid: true
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            data: [{
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 0,
                taskName: 'Start prototype',
                partialFill: 0.25
            }, {
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 1,
                taskName: 'Develop',
                partialFill: 0.12
            }, {
                start: Date.UTC(2014, 10, 25, 12),
                milestone: true,
                taskName: 'Prototype done',
                taskGroup: 0
            }, {
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Test prototype',
                taskGroup: 0
            }, {
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                taskName: 'Run acceptance tests',
                taskGroup: 2
            }]
        }]
    };
});

/**
 * Checks that milestones are drawn differently than tasks
 */
QUnit.test('Milestones', function (assert) {
    var chart = Highcharts.chart('container', defaultChartConfig),
        points = chart.series[0].points,
        taskPoint = points[0],
        milestonePoint = points[2],
        milestone = milestonePoint.milestone,
        path,
        isDiamond,
        topX,
        topY,
        rightX,
        rightY,
        bottomX,
        bottomY,
        leftX,
        leftY,
        height,
        width,
        floatError = 0.00001;

    assert.equal(
        taskPoint.milestone,
        undefined,
        'Task does not have a milestone property'
    );

    assert.equal(
        typeof milestonePoint.milestone,
        'object',
        'Milestone has a milestone object property'
    );

    assert.equal(
        typeof milestone.d,
        'string',
        'Milestone has a \'d\' value'
    );

    // Remove path letters
    path = milestone.d.replace(/[a-zA-Z]/g, '');
    // Replace sequences of space characters with single spaces
    path = path.replace(/\s+/g, ' ');
    // Remove surrounding spaces
    path = path.trim();
    // Split on spaces to create an array
    path = path.split(' ');

    topX = parseFloat(path[0]);
    topY = parseFloat(path[1]);
    rightX = parseFloat(path[2]);
    rightY = parseFloat(path[3]);
    bottomX = parseFloat(path[4]);
    bottomY = parseFloat(path[5]);
    leftX = parseFloat(path[6]);
    leftY = parseFloat(path[7]);

    height = bottomY - topY;
    width = rightX - leftX;

    // The path is a diamond if:
    // 1. The top and bottom x values are aligned
    // 2. The left and right y values are aligned
    // 3. The width and height are the same
    // 4. The path has only 4 vectors
    isDiamond = topX === bottomX &&
                leftY === rightY &&
                Math.abs(width - height) < floatError;

    assert.ok(
        isDiamond,
        'Milestone path is a diamond'
    );
});
