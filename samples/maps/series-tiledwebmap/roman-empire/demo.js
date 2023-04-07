(async () => {

    // Load the map of the Roman provinces
    const provinces = await fetch(
        'https://cdn.jsdelivr.net/gh/klokantech/roman-empire@master/data/provinces.geojson'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map: provinces
        },

        title: {
            text: 'The Roman Empire'
        },

        subtitle: {
            text: 'An example of shapes crossing current borders'
        },

        credits: {
            mapText: '\u00a9 <a href="https://github.com/klokantech/roman-empire">klokantech</a>'
        },

        navigation: {
            buttonOptions: {
                align: 'left',
                x: 9,
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

        mapView: {
            padding: ['10%', '2%', '2%', 0]
        },

        plotOptions: {
            map: {
                showInLegend: false
            }
        },

        series: [{
            type: 'tiledwebmap',
            provider: {
                type: 'Stamen',
                theme: 'Watercolor'
            },
            showInLegend: false
        }, {
            name: 'Roman empire',
            nullColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: '#666',
            dataLabels: {
                enabled: true,
                nullFormat: '{point.name}'
            },
            accessibility: {
                point: {
                    valueDescriptionFormat: '{xDescription}.'
                }
            }
        }]
    });
})();
