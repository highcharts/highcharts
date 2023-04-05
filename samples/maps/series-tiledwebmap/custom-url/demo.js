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

    mapNavigation: {
        enabled: true
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            url: 'https://a.tile.openstreetmap.org/{zoom}/{x}/{y}.png'
        },
        showInLegend: false
    }]
});
