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
            x: -1,
            y: 10,
            height: 28,
            width: 28,
            symbolSize: 14,
            symbolX: 14.5,
            symbolY: 13.5,
            theme: {
                'stroke-width': 1,
                stroke: 'silver',
                r: 8,
                padding: 10
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            x: 10,
            theme: {
                r: 8
            }
        },
        buttons: {
            zoomIn: {
                y: 10
            },
            zoomOut: {
                y: 38
            }
        }
    },

    series: [{
        type: 'tiledwebmap',
        provider: {
            url: 'https://a.tile.openstreetmap.org/{zoom}/{x}/{y}.png'
        },
        showInLegend: false
    }]
});
