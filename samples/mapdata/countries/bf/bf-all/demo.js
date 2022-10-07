(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/bf/bf-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['bf-ka', 10], ['bf-ob', 11], ['bf-pa', 12], ['bf-zm', 13],
        ['bf-sg', 14], ['bf-ss', 15], ['bf-zr', 16], ['bf-lo', 17],
        ['bf-yt', 18], ['bf-nm', 19], ['bf-st', 20], ['bf-bl', 21],
        ['bf-kl', 22], ['bf-gz', 23], ['bf-kr', 24], ['bf-nr', 25],
        ['bf-zw', 26], ['bf-io', 27], ['bf-bb', 28], ['bf-tu', 29],
        ['bf-le', 30], ['bf-km', 31], ['bf-po', 32], ['bf-gg', 33],
        ['bf-kj', 34], ['bf-se', 35], ['bf-yg', 36], ['bf-ta', 37],
        ['bf-7399', 38], ['bf-kp', 39], ['bf-gm', 40], ['bf-ho', 41],
        ['bf-kn', 42], ['bf-bw', 43], ['bf-ks', 44], ['bf-ba', 45],
        ['bf-mo', 46], ['bf-od', 47], ['bf-sm', 48], ['bf-ny', 49],
        ['bf-sr', 50], ['bf-bm', 51], ['bf-bk', 52], ['bf-kw', 53],
        ['bf-bz', 54]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bf/bf-all.topo.json">Burkina Faso</a>'
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
