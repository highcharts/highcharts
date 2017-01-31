$(function () {

    // THE CHART
    Highcharts.ganttChart('container', {
        title: {
            text: 'Gantt Chart with Progress Indicators'
        },
        xAxis: {
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        },
        yAxis: [{
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        }],
        series: [{
            name: 'Project 1',
            data: [{
                start: Date.UTC(2014, 10, 18),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 0,
                taskName: 'Start prototype',
                completed: 0.25
            }, {
                start: Date.UTC(2014, 10, 20),
                end: Date.UTC(2014, 10, 25),
                taskGroup: 1,
                taskName: 'Develop',
                completed: {
                    amount: 0.12,
                    fill: '#fa0'
                }
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
        }]
    });
});
