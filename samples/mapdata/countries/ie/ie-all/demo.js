(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ie/ie-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ie-ww', 10], ['ie-d', 11], ['ie-mh', 12], ['ie-wd', 13],
        ['ie-mn', 14], ['ie-cn', 15], ['ie-dl', 16], ['ie-lm', 17],
        ['ie-ke', 18], ['ie-ls', 19], ['ie-cw', 20], ['ie-kk', 21],
        ['ie-wx', 22], ['ie-ky', 23], ['ie-co', 24], ['ie-ta', 25],
        ['ie-ce', 26], ['ie-lk', 27], ['ie-so', 28], ['ie-oy', 29],
        ['ie-rn', 30], ['ie-g', 31], ['ie-ld', 32], ['ie-wh', 33],
        ['ie-mo', 34], ['ie-lh', 35]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ie/ie-all.topo.json">Ireland</a>'
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
