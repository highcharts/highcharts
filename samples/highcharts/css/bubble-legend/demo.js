Highcharts.chart('container', {

    chart: {
        type: 'bubble',
        styledMode: true
    },

    legend: {
        enabled: true,
        itemMarginTop: 10,
        bubbleLegend: {
            enabled: true,
            borderWidth: 1,
            maxSize: 60,
            minSize: 10,
            color: '#7cb5ec', // In styled mode presentational styles from the API are replaced by CSS
            connectorDistance: 40,
            ranges: [
                { value: 1 },
                { value: 50 },
                { value: 100 },
                { value: 177 }
            ]
        }
    },

    series: [{
        maxSize: 60,
        minSize: 10,
        data: [
            { x: 2, y: 7, z: 24 },
            { x: 3, y: 2, z: 153 },
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
