Highcharts.chart('container', {
    chart: {
        animation: false
    },

    title: {
        text: 'Highcharts draggable points demo'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec']
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
                            'Dragging <b>' + this.series.name + '</b>, <b>' +
                            this.category + '</b> to <b>' +
                            Highcharts.numberFormat(e.y, 2) + '</b>';
                    },
                    drop: function () {
                        document.getElementById('drop').innerHTML =
                            'In <b>' + this.series.name + '</b>, <b>' +
                            this.category + '</b> was set to <b>' +
                            Highcharts.numberFormat(this.y, 2) + '</b>';
                    }
                }
            },
            stickyTracking: false
        },
        column: {
            stacking: 'normal'
        },
        line: {
            cursor: 'ns-resize'
        }
    },

    tooltip: {
        yDecimals: 2
    },

    series: [{
        data: [0, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4],
        dragDrop: {
            //draggableX: true,
            draggableY: true,
            dragMinY: 0
        },
        type: 'column',
        minPointLength: 2
    }, {
        data: [0, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4].reverse(),
        dragDrop: {
            draggableY: true,
            dragMinY: 0
        },
        type: 'column',
        minPointLength: 2
    }, {
        data: [0, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4],
        dragDrop: {
            draggableY: true
        }
    }]
});
