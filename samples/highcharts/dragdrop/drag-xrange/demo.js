Highcharts.chart('container', {
    chart: {
        animation: false,
        type: 'xrange'
    },

    title: {
        text: 'Highcharts draggable xrange demo'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true
            },
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

    xAxis: {
        type: 'datetime',
        min: Date.UTC(2014, 10, 15),
        max: Date.UTC(2015, 0, 10)
    },

    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing']
    },

    series: [{
        name: 'Project 1',
        cursor: 'move',
        dragDrop: {
            draggableX: true,
            //draggableY: true,
            enableResize: true,
            groupBy: 'myGroup'
        },
        data: [{
            x: Date.UTC(2014, 11, 1),
            x2: Date.UTC(2014, 11, 2),
            partialFill: 0.95,
            y: 0
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            partialFill: 0.5,
            y: 1
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            partialFill: 0.15,
            y: 2
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            partialFill: {
                amount: 0.3,
                fill: '#fa0'
            },
            y: 1,
            dragDrop: {
                draggableY: true,
                draggableX: false
            }
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            myGroup: 'John',
            y: 2
        }, {
            x: Date.UTC(2014, 11, 25),
            x2: Date.UTC(2014, 11, 26),
            myGroup: 'John',
            y: 2
        }, {
            x: Date.UTC(2014, 11, 24),
            x2: Date.UTC(2014, 11, 26),
            myGroup: 'Bob',
            y: 1,
            dragDrop: {
                draggableY: true
            }
        }, {
            x: Date.UTC(2014, 11, 26),
            x2: Date.UTC(2014, 11, 28),
            myGroup: 'Bob',
            y: 1,
            dragDrop: {
                draggableY: true
            }
        }, {
            x: Date.UTC(2014, 11, 28),
            x2: Date.UTC(2014, 11, 30),
            myGroup: 'Bob',
            y: 1,
            dragDrop: {
                draggableY: true
            }
        }]
    }]
});

