var today = new Date(),
    day = 1000 * 60 * 60 * 24;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Grouping tasks vertically'
    },
    yAxis: {
        categories: ['Resource 1', 'Resource 2', 'Resource 3']
    },
    series: [{
        name: 'Resource 1',
        data: [{
            name: 'Task A',
            y: 0,
            start: today - (2 * day),
            end: today + (6 * day)
        }, {
            name: 'Task B',
            y: 0,
            start: today + (8 * day),
            end: today + (10 * day),
            color: 'rgba(140, 140, 140, 0.7)'
        }, {
            name: 'Task C',
            y: 0,
            start: today + (13 * day),
            end: today + (17 * day)
        }]
    }, {
        name: 'Resource 2',
        data: [{
            name: 'Task D',
            y: 1,
            start: today - (1 * day),
            end: today + (6 * day)
        }, {
            name: 'Task E',
            y: 1,
            start: today + (7 * day),
            end: today + (9 * day)
        }, {
            name: 'Task F',
            y: 1,
            start: today + (11 * day),
            end: today + (12 * day)
        }, {
            name: 'Task G',
            y: 1,
            start: today + (14 * day),
            end: today + (16 * day)
        }]
    }, {
        name: 'Resource 3',
        data: [{
            name: 'Task H',
            y: 2,
            start: today - (1.5 * day),
            end: today + (4 * day)
        }, {
            name: 'Task I',
            y: 2,
            start: today + (6 * day),
            end: today + (9 * day)
        }, {
            name: 'Task J',
            y: 2,
            start: today + (10 * day),
            end: today + (14 * day)
        }, {
            name: 'Task K',
            y: 2,
            start: today + (15 * day),
            end: today + (17 * day)
        }]
    }]
});
