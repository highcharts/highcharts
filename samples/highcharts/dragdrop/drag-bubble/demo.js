Highcharts.chart('container', {
    chart: {
        animation: false
    },

    title: {
        text: 'Highcharts draggable bubbles demo'
    },

    tooltip: {
        valueDecimals: 2
    },

    series: [{
        type: 'bubble',
        cursor: 'move',
        dragDrop: {
            draggableX: true,
            draggableY: true
        },
        data: [
            [100, 240, 3],
            [200, 130, 10],
            [450, 290, 15]
        ]
    }],

    yAxis: {
        softMin: 0,
        softMax: 350
    }
});
