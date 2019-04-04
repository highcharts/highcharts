Highcharts.chart('container', {

    chart: {
        type: 'bubble'
    },

    legend: {
        enabled: true,
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'top',
        itemMarginTop: 10,
        bubbleLegend: {
            enabled: true,
            borderWidth: 1,
            connectorDistance: 40,
            maxSize: 70,
            ranges: [{}, {}, { color: '#e4d354' }]
        }
    },

    plotOptions: {
        series: {
            maxSize: 70
        }
    },

    series: [{
        data: [
            { x: 95, y: 95, z: 834 },
            { x: 86.5, y: 102.9, z: 1000 },
            { x: 80.8, y: 91.5, z: 242 },
            { x: 80.4, y: 102.5, z: 121 }
        ]
    }, {
        data: [
            { x: 80.3, y: 86.1, z: 358 },
            { x: 78.4, y: 70.1, z: 450 },
            { x: 74.2, y: 68.5, z: 598 }
        ]
    }, {
        data: [
            { x: 73.5, y: 83.1, z: 678 },
            { x: 71, y: 93.2, z: 314 },
            { x: 69.2, y: 57.6, z: 415 },
            { x: 68.6, y: 20, z: 799 }
        ]
    }, {
        data: [
            { x: 65.5, y: 126.4, z: 35.3 },
            { x: 65.4, y: 50.8, z: 28.5 },
            { x: 63.4, y: 51.8, z: 15.4 },
            { x: 64, y: 82.9, z: 31.3 }
        ]
    }]

});
