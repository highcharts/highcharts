(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/af/af-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['af-kt', 10], ['af-pk', 11], ['af-gz', 12], ['af-bd', 13],
        ['af-nr', 14], ['af-kr', 15], ['af-kz', 16], ['af-ng', 17],
        ['af-tk', 18], ['af-bl', 19], ['af-kb', 20], ['af-kp', 21],
        ['af-2030', 22], ['af-la', 23], ['af-lw', 24], ['af-pv', 25],
        ['af-sm', 26], ['af-vr', 27], ['af-pt', 28], ['af-bg', 29],
        ['af-hr', 30], ['af-bk', 31], ['af-jw', 32], ['af-bm', 33],
        ['af-gr', 34], ['af-fb', 35], ['af-sp', 36], ['af-fh', 37],
        ['af-hm', 38], ['af-nm', 39], ['af-2014', 40], ['af-oz', 41],
        ['af-kd', 42], ['af-zb', 43]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/af/af-all.topo.json">Afghanistan</a>'
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
