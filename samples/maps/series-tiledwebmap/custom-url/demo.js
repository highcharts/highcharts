Highcharts.mapChart('container', {
    title: {
        text: 'Custom URL in TiledWebMap configuration'
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
        }
    }]
});
