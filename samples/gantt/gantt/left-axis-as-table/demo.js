$(function () {

    // THE CHART
    Highcharts.ganttChart('container', {
        title: {
            text: 'Gantt Chart'
        },
        xAxis: {
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        },
        yAxis: [{
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        }, {
            linkedTo: 0,
            categories: ['Lennie', 'Jenny', 'Lennie and Jennie'],
            reversed: true
        }],
        series: [{
            name: 'Project 1',
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
                start: Date.UTC(2014, 10, 25, 12),
                milestone: true,
                taskName: 'Prototype done',
                taskGroup: 0
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
