Highcharts.chart('container', {
    yAxis: {
        softMin: -200,
        softMax: 200
    },

    xAxis: {
        min: 0.5,
        max: 3.5
    },

    tooltip: {
        enabled: false
    },

    title: {
        text: 'Drag & drop disabled for specific points.'
    },

    series: [{
        dragDrop: {
            draggableY: true
        },

        point: {
            events: {
                drag: function () {
                    return this.className !== 'undraggable';
                },
                drop: function () {
                    return this.className !== 'undraggable';
                }
            }
        },

        dataLabels: {
            enabled: true,
            y: -6,
            format: '{point.className}'
        },

        cursor: 'ns-resize',

        data: [{
            x: 1,
            y: -25
        }, {
            x: 2,
            y: 1,
            color: '#f33',
            className: 'undraggable'
        }, {
            x: 3,
            y: 25
        }]
    }]
});
