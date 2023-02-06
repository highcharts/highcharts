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

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom',
                x: 10
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
            nullColor: 'rgb(255 0 0 / 0.5)',
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
