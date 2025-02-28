Highcharts.ganttChart('container', {
    title: {
        text: 'Grouping in a hierarchy'
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-20'
        }, {
            // parent task
            name: 'Product Launch',
            id: 'launch',
            // hide the subtasks
            // collapsed: true
            // use a smaller pointwidth for the parent task
            pointWidth: 3
        }, {
            parent: 'launch',
            id: 'b',
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25'
        }, {
            parent: 'launch',
            id: 'a',
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26'
        }, {
            parent: 'launch',
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29'
        }]
    }]
});
