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
            start: '2014-12-01',
            end: '2014-12-02',
            completed: 0.95,
            groupId: 'group1',
            y: 0
        }, {
            start: '2014-12-03',
            end: '2014-12-05',
            groupId: 'group1',
            y: 0
        }, {
            start: '2014-12-02',
            end: '2014-12-05',
            y: 1
        }]
    }]
});
