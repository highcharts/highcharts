Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: 'Highcharts Maps basic TiledWebMap Series'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            alignTo: 'spacingBox'
        }
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
