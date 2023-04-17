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
            x: -1,
            height: 28,
            width: 28,
            symbolSize: 14,
            symbolX: 14.5,
            symbolY: 13.5,
            theme: {
                'stroke-width': 1,
                stroke: 'silver',
                padding: 10
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
