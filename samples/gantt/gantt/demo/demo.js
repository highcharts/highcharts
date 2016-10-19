$(function () {

    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'gantt',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Highcharts GridAxis'
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
            title: '',
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
                partialFill: {
                    amount: 0.12,
                    fill: '#fa0'
                }
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
        }, {
            name: 'Project 2',
            borderRadius: 10,
            visible: false,
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
