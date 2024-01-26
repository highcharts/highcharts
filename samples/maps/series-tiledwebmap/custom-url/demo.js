Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
    },

    mapView: {
        projection: {
            name: 'WebMercator' // Projection is required for custom URL
        },
        zoom: 4
    },

    navigation: {
        buttonOptions: {
            align: 'left',
            theme: {
                stroke: '#e6e6e6'
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            alignTo: 'spacingBox'
        }
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            url: 'https://tile.openstreetmap.org/{zoom}/{x}/{y}.png'
        },
        showInLegend: false
    }]
});
