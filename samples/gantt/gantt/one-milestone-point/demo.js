Highcharts.ganttChart('container', {
    title: {
        text: 'Simple Gantt Chart'
    },

    series: [{
        name: 'Project 1',
        data: [{
            id: 's',
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-20'
        }, {
            id: 'b',
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25',
            dependency: 's'
        }, {
            id: 'a',
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }, {
            name: 'Prototype finished',
            start: '2014-11-27',
            end: '2014-11-29',
            dependency: ['a', 'b'],
            milestone: true
        }]
    }]
});
