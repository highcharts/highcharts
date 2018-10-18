Highcharts.chart('container', {
    pathfinder: {
        marker: {
            enabled: true
        },
        startMarker: {
            align: 'right'
        },
        endMarker: {
            align: 'left'
        },
        type: 'simpleConnect'
    },
    series: [{
        data: [{
            id: '1',
            y: 11.5,
            connect: '16'
        }, {
            id: '2',
            y: 71.5
        }, {
            id: '3',
            y: 31.5
        }, {
            id: '4',
            y: 51.5
        }, {
            id: '5',
            y: 81.5,
            connect: '18'
        }, {
            id: '6',
            y: 11.5
        }, {
            id: '7',
            y: 91.5
        }, {
            id: '8',
            y: 31.5,
            connect: '2'
        }],
        type: 'scatter'
    }, {
        data: [{
            id: '11',
            y: 1.5,
            connect: '16'
        }, {
            id: '12',
            y: 31.5,
            connect: '7'
        }, {
            id: '13',
            y: 11.5
        }, {
            id: '14',
            y: 41.5
        }, {
            id: '15',
            y: 61.5
        }, {
            id: '16',
            y: 1.5
        }, {
            id: '17',
            y: 71.5
        }, {
            id: '18',
            y: 11.5
        }],
        type: 'column'
    }]
});
