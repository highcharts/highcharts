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
    //    reversed: true
    },

    yAxis: {
        type: 'category',
        categories: ['A', 'B', 'C']
        //reversed: true
    },

    series: [{
        name: 'Project 1',
        dragDrop: {
            draggableX: true,
            liveRedraw: false,
            draggableY: true,
            dragMinY: 0
            //groupBy: 'groupId'
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
