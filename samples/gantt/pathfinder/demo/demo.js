Highcharts.chart('container', {
    chart: {
        type: 'xrange'
    },
    title: {
        text: 'Pathfinder connections'
    },
    xAxis: {
        type: 'datetime',
        min: '2014-12-01',
        max: '2014-12-23'
    },
    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true
            },
            // Set default connection options here
            connectors: {
                lineWidth: 2
            }
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            x: '2014-12-01',
            x2: '2014-12-02',
            partialFill: 0.95,
            y: 0,
            id: 'first'
        }, {
            x: '2014-12-02',
            x2: '2014-12-05',
            partialFill: 0.5,
            y: 1,
            id: 'second',
            connect: 'third' // Set a default connection to a point
        }, {
            x: '2014-12-08',
            x2: '2014-12-09',
            partialFill: 0.15,
            y: 2,
            id: 'third'
        }, {
            x: '2014-12-09',
            x2: '2014-12-19',
            partialFill: {
                amount: 0.3,
                fill: '#fa0'
            },
            y: 1,
            id: 'fourth',
            // Define custom connection options
            connect: {
                to: 'first', // Which point to connect to
                lineColor: 'red', // Color of the connecting line
                dashStyle: 'dash', // Dash style for line
                lineWidth: 2, // Width of line
                type: 'simpleConnect', // Algorithm type
                startMarker: {
                    align: 'right', // Where to start the line (horizontally)
                    enabled: true, // Add the marker symbol
                    symbol: 'square', // Use a square symbol
                    radius: 4, // Size of symbol
                    color: 'red' // Color of symbol
                },
                endMarker: {
                    align: 'right', // Where to end the line (horizontally)
                    verticalAlign: 'top' // Where to end line (vertically)
                }
            }
        }, {
            x: '2014-12-10',
            x2: '2014-12-23',
            y: 2,
            id: 'fifth',
            // Define multiple connections from this point
            connect: [
                'fourth', // Simple default connection
                {
                    // Custom connection
                    to: 'second', // Which point to connect to
                    type: 'fastAvoid', // Algorithm
                    lineColor: '#290' // Color of the connection line
                }
            ]
        }]
    }, {
        name: 'Scatter',
        type: 'scatter',
        dataLabels: {
            format: '{point.name}'
        },
        data: [{
            x: '2014-12-05',
            name: 'point1',
            y: 2,
            // Connecting to a point in a different series is the same
            connect: {
                to: 'first',
                type: 'fastAvoid',
                endMarker: {
                    verticalAlign: 'bottom'
                }
            }
        }, {
            x: '2014-12-10',
            name: 'point2',
            y: 0
        }]
    }]
});
