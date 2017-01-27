var defaultChartConfig;

QUnit.testStart(function () {
    defaultChartConfig = {
        title: {
            text: 'Projects'
        },
        xAxis: [{
            labels: {
                format: '{value:%E}'
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}'
            },
            linkedTo: 0
        }],
        yAxis: [{
            grid: true
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            data: [{
                id: 'start_prototype',
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 'Start prototype',
                taskName: 'Start prototype',
                y: 0,
                partialFill: 0.25
            }, {
                id: 'prototype_done',
                start: Date.UTC(2014, 10, 25, 12),
                milestone: true,
                taskName: 'Prototype done',
                taskGroup: 'Prototype done',
                y: 1
            }, {
                id: 'test_prototype',
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Test prototype',
                taskGroup: 'Test prototype',
                y: 2
            }, {
                id: 'development',
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 'Develop',
                taskName: 'Develop',
                y: 3,
                partialFill: 0.12
            }, {
                id: 'unit_tests',
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 22),
                y: 4,
                parent: 'development',
                taskGroup: 'Create unit tests',
                taskName: 'Create unit tests',
                partialFill: {
                    amount: 0.5,
                    fill: '#fa0'
                }
            }, {
                id: 'implement',
                start: Date.UTC(2014, 10, 22),
                end: Date.UTC(2014, 10, 25),
                y: 5,
                taskGroup: 'Implement',
                parent: 'development',
                taskName: 'Implement'
            }, {
                id: 'acceptance_tests',
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                taskName: 'Run acceptance tests',
                taskGroup: 'Run acceptance tests',
                y: 6
            }]
        }]
    };
});

/**
 * Checks that milestones are drawn differently than tasks
 */
QUnit.test('Milestones', function (assert) {
    var chart = Highcharts.ganttChart('container', defaultChartConfig),
        points = chart.series[0].points,
        taskPoint = points[0],
        milestonePoint = points[1],
        milestone = milestonePoint.graphic,
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
        'Point with no miliestone:true is not a milestone'
    );

    assert.equal(
        milestonePoint.milestone,
        true,
        'Point with milestone:true is a milestone'
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
