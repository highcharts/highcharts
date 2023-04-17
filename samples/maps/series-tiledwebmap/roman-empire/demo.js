(async () => {

    // Load the map of the Roman provinces
    const provinces = await fetch(
        'https://cdn.jsdelivr.net/gh/klokantech/roman-empire@master/data/provinces.geojson'
    ).then(response => response.json());

    // Initialize the chart
    Highcharts.mapChart('container', {

        chart: {
            map: provinces,
            margin: 0
        },

        title: {
            text: 'The Roman Empire',
            align: 'right'
        },

        subtitle: {
            text: 'An example of shapes crossing current borders',
            align: 'right'
        },

        credits: {
            mapText: '\u00a9 <a href="https://github.com/klokantech/roman-empire">klokantech</a>'
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
