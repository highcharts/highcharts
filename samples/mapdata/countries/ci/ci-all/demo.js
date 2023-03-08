(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ci/ci-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ci-sc', 10], ['ci-3397', 11], ['ci-de', 12], ['ci-bf', 13],
        ['ci-ba', 14], ['ci-wr', 15], ['ci-zu', 16], ['ci-fr', 17],
        ['ci-3404', 18], ['ci-la', 19], ['ci-so', 20], ['ci-za', 21],
        ['ci-vb', 22], ['ci-av', 23], ['ci-bg', 24], ['ci-ab', 25],
        ['ci-3412', 26], ['ci-3413', 27], ['ci-tm', 28]
    ];

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps basic demo'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ci/ci-all.topo.json">Ivory Coast</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

})();
