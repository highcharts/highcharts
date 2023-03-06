Highcharts.ganttChart('container', {
    title: {
        text: 'Tweaking dependencies'
    },
    pathfinder: {
        lineColor: 'black',
        marker: {
            color: 'black'
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            id: 'p1',
            name: 'project 1',
            pointWidth: 3,
            color: 'black'
        }, {
            id: '1A',
            name: 'task A',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 20),
            parent: 'p1'
        }, {
            id: '1B',
            name: 'task B',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            dependency: '1A',
            parent: 'p1'
        }]
    }, {
        name: 'Project 2',
        pathfinder: {
            type: 'fastAvoid',
            lineColor: 'red',
            dashStyle: 'Dash'
        },
        data: [{
            id: 'p2',
            name: 'Project 2',
            pointWidth: 3,
            color: 'black'
        }, {
            id: '2A',
            name: 'task A',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
            parent: 'p2'
        }, {
            id: '2B',
            name: 'task B',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            dependency: ['1B', '2A'],
            parent: 'p2'
        }]
    }]
});
