Highcharts.ganttChart('container', {
    title: {
        text: 'Grouping in a hierarchy'
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 20)
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
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25)
        }, {
            parent: 'launch',
            id: 'a',
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26)
        }, {
            parent: 'launch',
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29)
        }]
    }]
});
