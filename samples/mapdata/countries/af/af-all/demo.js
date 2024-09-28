(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/af/af-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['af-bds', 10], ['af-tak', 11], ['af-nur', 12], ['af-kdz', 13],
        ['af-kan', 14], ['af-hel', 15], ['af-knr', 16], ['af-nim', 17],
        ['af-lag', 18], ['af-kap', 19], ['af-nan', 20], ['af-par', 21],
        ['af-bgl', 22], ['af-sam', 23], ['af-bal', 24], ['af-jow', 25],
        ['af-fra', 26], ['af-her', 27], ['af-bdg', 28], ['af-fyb', 29],
        ['af-gho', 30], ['af-day', 31], ['af-zab', 32], ['af-bam', 33],
        ['af-log', 34], ['af-kab', 35], ['af-kho', 36], ['af-pia', 37],
        ['af-uru', 38], ['af-sar', 39], ['af-pan', 40], ['af-pka', 41],
        ['af-gha', 42], ['af-war', 43]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/af/af-all.topo.json">Afghanistan</a>'
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
