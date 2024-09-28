(async () => {

    // Load the base world map
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

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
                align: 'right',
                alignTo: 'spacingBox',
                verticalAlign: 'top'
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
            name: 'World',
            data: [],
            affectsMapView: false,
            mapData: world,
            borderColor: 'white',
            nullColor: '#ddeedd',
            accessibility: {
                exposeAsGroupOnly: true
            }
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
