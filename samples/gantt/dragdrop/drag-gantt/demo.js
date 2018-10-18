Highcharts.ganttChart('container', {
    chart: {
        type: 'gantt'
    },

    title: {
        text: 'Highcharts draggable gantt demo'
    },

    xAxis: {
        minPadding: 0.2,
        maxPadding: 0.2
    },

    yAxis: {
        type: 'category',
        categories: ['A', 'B', 'C'],
        min: 0,
        max: 2
    },

    series: [{
        name: 'Project 1',
        dragDrop: {
            liveRedraw: false,
            draggableX: true,
            draggableY: true,
            dragMinY: 0,
            dragMaxY: 2,
            groupBy: 'groupId'
        },
        data: [{
            start: Date.UTC(2014, 11, 1),
            end: Date.UTC(2014, 11, 2),
            completed: 0.95,
            groupId: 'group1',
            y: 0
        }, {
            start: Date.UTC(2014, 11, 3),
            end: Date.UTC(2014, 11, 5),
            groupId: 'group1',
            y: 0
        }, {
            start: Date.UTC(2014, 11, 2),
            end: Date.UTC(2014, 11, 5),
            y: 1
        }]
    }]
});
