(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ie/ie-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ie-5551', 10], ['ie-1510', 11], ['ie-mo', 12], ['ie-ky', 13],
        ['ie-dl', 14], ['ie-491', 15], ['ie-ce', 16], ['ie-7034', 17],
        ['ie-7035', 18], ['ie-ld', 19], ['ie-cn', 20], ['ie-2363', 21],
        ['ie-mn', 22], ['ie-gy', 23], ['ie-ck', 24], ['ie-wd', 25],
        ['ie-7033', 26], ['ie-1528', 27], ['ie-dn', 28], ['ie-lh', 29],
        ['ie-mh', 30], ['ie-oy', 31], ['ie-wh', 32], ['ie-wx', 33],
        ['ie-cw', 34], ['ie-ww', 35], ['ie-ke', 36], ['ie-kk', 37],
        ['ie-ls', 38], ['ie-ty', 39], ['ie-1533', 40], ['ie-lk', 41],
        ['ie-rn', 42], ['ie-so', 43], ['ie-lm', 44]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ie/ie-all.topo.json">Ireland</a>'
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
