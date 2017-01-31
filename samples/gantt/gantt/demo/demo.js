$(function () {

    var today = new Date(),
        day = 1000 * 60 * 60 * 24;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);


    // THE CHART
    Highcharts.ganttChart('container', {
        title: {
            text: 'Gantt Chart'
        },
        xAxis: {
            currentDateIndicator: true,
            min: today.getTime() - (3 * day),
            max: today.getTime() + (11 * day)
        },
        series: [{
            name: 'Project 1',
            data: [{
                id: 'start_prototype',
                start: today.getTime() - (2 * day),
                end: today.getTime() + day,
                y: 0,
                taskGroup: 'Start prototype',
                taskName: 'Start prototype',
                partialFill: 0.8
            }, {
                start: today.getTime() + (day * 1.5),
                milestone: true,
                taskGroup: 'Prototype done',
                taskName: 'Prototype done',
                y: 1
            }, {
                start: today.getTime() + (2 * day),
                end: today.getTime() + (6 * day),
                taskGroup: 'Test prototype',
                taskName: 'Test prototype',
                y: 2
            }, {
                id: 'development',
                start: today.getTime(),
                end: today.getTime() + (8 * day),
                y: 3,
                taskName: 'Develop',
                taskGroup: 'Develop',
                dependency: 'start_prototype',
                partialFill: {
                    amount: 0.12,
                    fill: '#fa0'
                }
            }, {
                id: 'unit_tests',
                start: today.getTime(),
                end: today.getTime() + (3 * day),
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
                start: today.getTime() + (3 * day),
                end: today.getTime() + (8 * day),
                y: 5,
                taskGroup: 'Implement',
                parent: 'development',
                taskName: 'Implement'
            }, {
                start: today.getTime() + (7 * day),
                end: today.getTime() + (10 * day),
                dependency: 'development',
                taskGroup: 'Run acceptance tests',
                taskName: 'Run acceptance tests',
                y: 6
            }]
        }, {
            name: 'Project 2',
            visible: false,
            data: [{
                start: today.getTime() - (2 * day),
                end: today.getTime(),
                taskName: 'Create protoype',
                y: 7
            }, {
                start: today.getTime() + day,
                end: today.getTime() + (3 * day),
                taskName: 'Write unit tests',
                y: 8
            }, {
                start: today.getTime() + (4 * day),
                end: today.getTime() + (9 * day),
                taskName: 'Develop',
                y: 9
            }, {
                start: today.getTime() + (9 * day),
                end: today.getTime() + (10 * day),
                taskName: 'Run user tests',
                y: 10
            }]
        }]
    });
});
