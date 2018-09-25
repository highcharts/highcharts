Highcharts.ganttChart('container', {
    chart: {
        type: 'gantt'
    },

    title: {
        text: 'Highcharts draggable gantt demo'
    },

    yAxis: {
        type: 'category',
        categories: ['A', 'B', 'C']
    },

    series: [{
        name: 'Project 1',
        dragDrop: {
            draggableX: true,
            realTimeCollisionDetection: false,
            draggableY: true,
            groupBy: 'groupId'
        },
        data: [{
            start: Date.UTC(2014, 11, 1),
            end: Date.UTC(2014, 11, 2),
            completed: 0.95,
            id: 'One',
            groupId: 'bob',
            y: 0
        }, {
            start: Date.UTC(2014, 11, 2),
            end: Date.UTC(2014, 11, 5),
            id: 'Two',
            groupId: 'bob',
            y: 1
        }]
    }]
});
