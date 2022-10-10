(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/br/br-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['br-sp', 10], ['br-ma', 11], ['br-pa', 12], ['br-sc', 13],
        ['br-ba', 14], ['br-ap', 15], ['br-ms', 16], ['br-mg', 17],
        ['br-go', 18], ['br-rs', 19], ['br-to', 20], ['br-pi', 21],
        ['br-al', 22], ['br-pb', 23], ['br-ce', 24], ['br-se', 25],
        ['br-rr', 26], ['br-pe', 27], ['br-pr', 28], ['br-es', 29],
        ['br-rj', 30], ['br-rn', 31], ['br-am', 32], ['br-mt', 33],
        ['br-df', 34], ['br-ac', 35], ['br-ro', 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/br/br-all.topo.json">Brazil</a>'
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
