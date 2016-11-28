$(function () {

    // THE CHART
    Highcharts.chart('container', {
        chart: {
            type: 'gantt',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Gantt Chart with Multiple Projects'
        },
        xAxis: [{
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '15px'
                }
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30),
            currentDateIndicator: true
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}',
                style: {
                    fontSize: '15px'
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
            data: [{
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 0,
                taskName: 'Start prototype'
            }, {
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 1,
                taskName: 'Develop'
            }, {
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 29),
                taskName: 'Test prototype',
                taskGroup: 0
            }, {
                start: Date.UTC(2014, 10, 23),
                end: Date.UTC(2014, 10, 26),
                taskName: 'Run acceptance tests',
                taskGroup: 2
            }]
        }, {
            name: 'Project 2',
            data: [{
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 19),
                taskName: 'Create protoype',
                taskGroup: 0
            }, {
                start: Date.UTC(2014, 10, 19),
                end: Date.UTC(2014, 10, 23),
                taskName: 'Write unit tests',
                taskGroup: 1
            }, {
                start: Date.UTC(2014, 10, 27),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Run user tests',
                taskGroup: 2
            }, {
                start: Date.UTC(2014, 10, 24),
                end: Date.UTC(2014, 10, 28),
                taskName: 'Develop',
                taskGroup: 1
            }]
        }]
    });
});
