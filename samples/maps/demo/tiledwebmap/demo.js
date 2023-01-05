Highcharts.mapChart('container', {
    title: {
        text: 'Highmaps basic TiledWebMap Series'
    },

    mapNavigation: {
        enabled: true
    },

    mapView: {
        projection: {
            name: 'WebMercator'
        },
        zoom: 4
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            type: 'OpenStreetMap'
        }
    }]
});
