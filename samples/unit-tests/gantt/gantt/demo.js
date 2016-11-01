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
                start: Date.UTC(2014, 10, 26),
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
    Highcharts.chart('container', defaultChartConfig);
    assert.ok(false, 'Not implemented');
});
