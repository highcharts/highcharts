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
            min: today.getTime() - (3 * day),
            max: today.getTime() + (11 * day)
        },
        series: [{
            name: 'Project 1',
            data: [{
                id: 'development',
                start: today.getTime(),
                end: today.getTime() + (8 * day),
                taskName: 'Develop',
                taskGroup: 'Develop',
                y: 0
            }, {
                id: 'unit_tests',
                start: today.getTime(),
                end: today.getTime() + (3 * day),
                y: 1,
                taskGroup: 'Create unit tests',
                taskName: 'Create unit tests',
                parent: 'development'
            }, {
                id: 'implement',
                start: today.getTime() + (3 * day),
                end: today.getTime() + (8 * day),
                y: 2,
                taskGroup: 'Implement',
                taskName: 'Implement',
                parent: 'development'
            }]
        }]
    });
});
