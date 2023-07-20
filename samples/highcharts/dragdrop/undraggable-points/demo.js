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
                    if (this.x === 2) {
                        return false;
                    }
                },
                drop: function () {
                    if (this.x === 2) {
                        return false;
                    }
                }
            }
        },

        dataLabels: {
            enabled: true,
            y: -6,
            formatter: function () {
                return this.x === 2 ? 'undraggable' : '';
            }
        },

        cursor: 'ns-resize',

        data: [{
            x: 1,
            y: -25
        }, {
            x: 2,
            y: 1,
            color: '#f33'
        }, {
            x: 3,
            y: 25
        }]
    }]
});
