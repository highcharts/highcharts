Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
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
        },
        showInLegend: false
    }]
});
