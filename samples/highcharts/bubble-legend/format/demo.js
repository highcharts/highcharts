Highcharts.chart('container', {

    chart: {
        type: 'bubble'
    },

    legend: {
        enabled: true,
        itemMarginTop: 10,
        bubbleLegend: {
            enabled: true,
            borderWidth: 1,
            labels: {
                format: '{value:.1f} mm'
            },
            connectorDistance: 40,
            ranges: [
                { color: 'transparent' },
                { color: 'transparent' },
                {
                    color: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#003399'],
                            [1, '#adccff']
                        ]
                    }
                }
            ]
        }
    },

    plotOptions: {
        series: {
            maxSize: 70
        }
    },

    series: [{
        data: [
            { x: 2, y: 7, z: 24 },
            { x: 1, y: 2, z: 153 },
            { x: 2, y: 12, z: 112 },
            { x: 4, y: 1, z: 79 },
            { x: 1, y: 14, z: 177 },
            { x: 2, y: 3, z: 89 },
            { x: 5, y: 7, z: 11 },
            { x: 6, y: 11, z: 16 },
            { x: 3, y: 9, z: 29 },
            { x: 1, y: 10, z: 55 }
        ]
    }]

});
