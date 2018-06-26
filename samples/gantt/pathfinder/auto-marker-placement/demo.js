Highcharts.chart('container', {
    series: [{
        pathfinder: {
            marker: {
                enabled: true
            }
        },
        data: [{
            x: 10,
            y: 10,
            id: 'center'
        }, {
            x: 10,
            y: 5,
            connect: 'center'
        }, {
            x: 15,
            y: 5,
            connect: 'center'
        }, {
            x: 15,
            y: 10,
            connect: 'center'
        }, {
            x: 15,
            y: 15,
            connect: 'center'
        }, {
            x: 10,
            y: 15,
            connect: 'center'
        }, {
            x: 5,
            y: 15,
            connect: 'center'
        }, {
            x: 5,
            y: 10,
            connect: 'center'
        }, {
            x: 5,
            y: 5,
            connect: 'center'
        }],
        type: 'scatter'
    }]
});
