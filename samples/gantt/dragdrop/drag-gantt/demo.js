Highcharts.ganttChart('container', {
    chart: {
        type: 'gantt'
    },

    title: {
        text: 'Highcharts draggable gantt demo'
    },

    series: [{
        name: 'Project 1',
        dragDrop: {
            draggableX: true,
            //draggableY: true,
            enableResize: true
        },
        data: [{
            start: Date.UTC(2014, 11, 1),
            end: Date.UTC(2014, 11, 2),
            completed: 0.95,
            id: 'One'
        }, {
            start: Date.UTC(2014, 11, 2),
            end: Date.UTC(2014, 11, 5),
            id: 'Two'
        }]
    }]
});

