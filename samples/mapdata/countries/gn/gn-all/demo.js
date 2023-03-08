(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/gn/gn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['gn-7097', 10], ['gn-7087', 11], ['gn-7108', 12], ['gn-3417', 13],
        ['gn-7106', 14], ['gn-3420', 15], ['gn-7098', 16], ['gn-7101', 17],
        ['gn-7092', 18], ['gn-7088', 19], ['gn-7103', 20], ['gn-3416', 21],
        ['gn-7094', 22], ['gn-7111', 23], ['gn-7109', 24], ['gn-7091', 25],
        ['gn-3418', 26], ['gn-7105', 27], ['gn-3421', 28], ['gn-7099', 29],
        ['gn-7104', 30], ['gn-7093', 31], ['gn-7107', 32], ['gn-7112', 33],
        ['gn-7090', 34], ['gn-7110', 35], ['gn-7089', 36], ['gn-3419', 37],
        ['gn-7096', 38], ['gn-7100', 39], ['gn-7102', 40], ['gn-7095', 41],
        ['gn-3422', 42], ['gn-3423', 43]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gn/gn-all.topo.json">Guinea</a>'
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
