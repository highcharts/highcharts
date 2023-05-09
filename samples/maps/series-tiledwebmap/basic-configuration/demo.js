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
            type: 'Stamen',
            theme: 'Toner',
            subdomain: 'c'
        },
        showInLegend: false
    }]
});
