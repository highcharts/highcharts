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
                    x: -15
                }
            }, {
                title: {
                    text: 'Assignee',
                    rotation: 45,
                    y: -15,
                    x: -15
                },
                labels: {
                    format: '{point.assignee}'
                }
            }, {
                title: {
                    text: 'Duration',
                    rotation: 45,
                    y: -15,
                    x: -15
                },
                labels: {
                    formatter: function () {
                        var point = this.point,
                            days = (1000 * 60 * 60 * 24),
                            number = (point.end - point.start) / days;
                        return Math.round(number * 100) / 100;
                    }
                }
            }]
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Start prototype',
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            completed: 0.25,
            assignee: 'Richards',
            y: 0
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            assignee: 'Richards',
            y: 1
        }, {
            name: 'Develop',
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            assignee: 'Richards',
            y: 2
        }, {
            name: 'Run acceptance tests',
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
            assignee: 'Richards',
            y: 3
        }]
    }]
});
