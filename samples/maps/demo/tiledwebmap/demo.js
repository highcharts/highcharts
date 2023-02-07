Highcharts.mapChart('container', {
    title: {
        text: 'Highcharts Maps basic TiledWebMap Series'
    },

    mapNavigation: {
        enabled: true
    },

    legend: {
        enabled: false
    },

    mapView: {
        center: [10, 50],
        zoom: 4
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            type: 'OpenStreetMap'
        }
    }]
});
