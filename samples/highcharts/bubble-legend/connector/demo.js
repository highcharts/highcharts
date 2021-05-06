Highcharts.chart('container', {

    chart: {
        type: 'bubble'
    },

    legend: {
        enabled: true,
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'top',
        itemMarginTop: 10,
        bubbleLegend: {
            legendIndex: 4,
            enabled: true,
            connectorDistance: 80,
            borderWidth: 3,
            connectorWidth: 3,
            labels: {
                align: 'left',
                style: {
                    fontSize: '18px'
                }
            }
        }
    },

    plotOptions: {
        series: {
            maxSize: 100,
            marker: {
                lineWidth: 3
            }
        }
    },

    series: [{
        data: [
            { x: 95, y: 95, z: 13.8 },
            { x: 86.5, y: 102.9, z: 14.7 },
            { x: 80.8, y: 91.5, z: 15.8 },
            { x: 80.4, y: 102.5, z: 12 }
        ]
    }, {
        data: [
            { x: 80.3, y: 86.1, z: 11.8 },
            { x: 78.4, y: 70.1, z: 16.6 },
            { x: 74.2, y: 68.5, z: 14.5 }
        ]
    }, {
        data: [
            { x: 73.5, y: 83.1, z: 10 },
            { x: 71, y: 93.2, z: 24.7 },
            { x: 69.2, y: 57.6, z: 10.4 },
            { x: 68.6, y: 20, z: 16 }
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
