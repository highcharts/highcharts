$(function () {

    var today = new Date(),
        day = 1000 * 60 * 60 * 24;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);


    // THE CHART
    Highcharts.chart('container', {
        chart: {
            type: 'gantt',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Gantt Chart'
        },
        xAxis: [{
            grid: true,
            currentDateIndicator: true,
            type: 'datetime',
            opposite: true,
            tickInterval: day, // Day
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '15px'
                }
            },
            min: today.getTime() - (3 * day),
            max: today.getTime() + (11 * day)
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: day * 7, // Week
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
                id: 'start_prototype',
                start: today.getTime() - (2 * day),
                end: today.getTime() + day,
                taskGroup: 0,
                taskName: 'Start prototype',
                partialFill: 0.8
            }, {
                id: 'development',
                start: today.getTime(),
                end: today.getTime() + (8 * day),
                taskGroup: 1,
                taskName: 'Develop',
                dependency: 'start_prototype',
                partialFill: {
                    amount: 0.12,
                    fill: '#fa0'
                }
            }, {
                start: today.getTime() + (day * 1.5),
                milestone: true,
                taskName: 'Prototype done',
                taskGroup: 0
            }, {
                start: today.getTime() + (2 * day),
                end: today.getTime() + (6 * day),
                taskName: 'Test prototype',
                taskGroup: 0
            }, {
                start: today.getTime() + (7 * day),
                end: today.getTime() + (10 * day),
                dependency: 'development',
                taskName: 'Run acceptance tests',
                taskGroup: 2
            }]
        }, {
            name: 'Project 2',
            visible: false,
            data: [{
                start: today.getTime() - (2 * day),
                end: today.getTime(),
                taskName: 'Create protoype',
                taskGroup: 0
            }, {
                start: today.getTime() + day,
                end: today.getTime() + (3 * day),
                taskName: 'Write unit tests',
                taskGroup: 1
            }, {
                start: today.getTime() + (4 * day),
                end: today.getTime() + (9 * day),
                taskName: 'Develop',
                taskGroup: 1
            }, {
                start: today.getTime() + (9 * day),
                end: today.getTime() + (10 * day),
                taskName: 'Run user tests',
                taskGroup: 2
            }]
        }]
    });
});
