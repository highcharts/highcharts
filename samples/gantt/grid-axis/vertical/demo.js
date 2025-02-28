Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Vertical Axis.grid'
    },

    yAxis: {
        type: 'category',
        grid: {
            borderColor: '#3a5d96',
            columns: [{
                title: {
                    text: 'Tasks',
                    rotation: 45,
                    y: -15,
                    x: -15,
                    style: {
                        width: '100px'
                    }
                }
            }, {
                title: {
                    text: 'Assignee',
                    rotation: 45,
                    y: -15,
                    x: -15,
                    style: {
                        width: '100px'
                    }
                },
                labels: {
                    format: '{point.assignee}'
                }
            }, {
                title: {
                    text: 'Duration',
                    rotation: 45,
                    y: -15,
                    x: -15,
                    style: {
                        width: '100px'
                    }
                },
                labels: {
                    format: '{(divide (subtract point.end point.start) ' +
                        '86400000):.0f}'
                }
            }]
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: '2014-11-18',
            end: '2014-11-25',
            completed: 0.25,
            assignee: 'Richards',
            y: 0
        }, {
            name: 'Test prototype',
            start: '2014-11-27',
            end: '2014-11-29',
            assignee: 'Richards',
            y: 1
        }, {
            name: 'Develop',
            start: '2014-11-20',
            end: '2014-11-25',
            assignee: 'Richards',
            y: 2
        }, {
            name: 'Run acceptance tests',
            start: '2014-11-23',
            end: '2014-11-26',
            assignee: 'Richards',
            y: 3
        }]
    }]
});
