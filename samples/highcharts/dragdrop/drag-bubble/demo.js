Highcharts.chart('container', {
    chart: {
        animation: false
    },

    title: {
        text: 'Highcharts draggable bubbles demo'
    },

    plotOptions: {
        series: {
            point: {
                events: {
                    drag: function (e) {
                        // Returning false stops the drag and drops. Example:
                        /*
                        if (e.newY > 300) {
                            this.y = 300;
                            return false;
                        }
                        */
                        document.getElementById('drag').innerHTML =
                            'Dragging ' + this.series.name +
                            ' point to <b>[' +
                            Highcharts.numberFormat(e.x, 2)  + ', ' +
                            Highcharts.numberFormat(e.y, 2) +
                            ']</b>';
                    },
                    drop: function () {
                        document.getElementById('drop').innerHTML =
                           'Dropped ' + this.series.name +
                           ' at <b>[' +
                           Highcharts.numberFormat(this.x, 2) + ', ' +
                           Highcharts.numberFormat(this.y, 2) +
                           ']</b>';
                    }
                }
            }
        }
    },

    tooltip: {
        yDecimals: 2
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
