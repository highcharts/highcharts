Highcharts.chart('container', {

    chart: {
        type: 'bubble'
    },

    legend: {
        enabled: true,
        y: -40,
        bubbleLegend: {
            enabled: true,
            borderWidth: 2,
            ranges: [{
                borderColor: '#1aadce',
                connectorColor: '#1aadce'
            }, {
                borderColor: '#0d233a',
                connectorColor: '#0d233a'
            }, {
                borderColor: '#f28f43',
                connectorColor: '#f28f43'
            }]
        }
    },

    series: [{
        data: [
            { x: 95, y: 95, z: 13.8 },
            { x: 86.5, y: 102.9, z: 14.7 },
            { x: 80.8, y: 91.5, z: 15.8 }
        ]
    }, {
        data: [
            { x: 74.2, y: 68.5, z: 14.5 },
            { x: 73.5, y: 83.1, z: 10 },
            { x: 71, y: 93.2, z: 24.7 },
            { x: 69.2, y: 57.6, z: 10.4 }
        ]
    }, {
        data: [
            { x: 80.4, y: 102.5, z: 12 },
            { x: 80.3, y: 86.1, z: 11.8 },
            { x: 78.4, y: 70.1, z: 16.6 }
        ]
    }, {
        data: [
            { x: 68.6, y: 20, z: 16 },
            { x: 65.5, y: 126.4, z: 35.3 },
            { x: 65.4, y: 50.8, z: 28.5 },
            { x: 63.4, y: 51.8, z: 15.4 },
            { x: 64, y: 82.9, z: 31.3 }
        ]
    }]

});
