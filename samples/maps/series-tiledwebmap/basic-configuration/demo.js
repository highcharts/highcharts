Highcharts.mapChart('container', {
    title: {
        text: 'Basic configuration for TiledWebMap'
    },

    mapView: {
        zoom: 4
    },

    mapNavigation: {
        enabled: true
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            type: 'Stamen',
            theme: 'Toner',
            subdomain: 'c'
        }
    }]
});
