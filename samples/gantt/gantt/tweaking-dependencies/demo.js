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
            start: '2014-11-18',
            end: '2014-11-20',
            parent: 'p1'
        }, {
            id: '1B',
            name: 'task B',
            start: '2014-11-20',
            end: '2014-11-25',
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
            start: '2014-11-23',
            end: '2014-11-26',
            parent: 'p2'
        }, {
            id: '2B',
            name: 'task B',
            start: '2014-11-27',
            end: '2014-11-29',
            dependency: ['1B', '2A'],
            parent: 'p2'
        }]
    }]
});
