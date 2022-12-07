(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ye/ye-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ye-3662', 10], ['ye-hu', 11], ['ye-3415', 12], ['ye-3427', 13],
        ['ye-ta', 14], ['ye-sd', 15], ['ye-mw', 16], ['ye-dh', 17],
        ['ye-hj', 18], ['ye-am', 19], ['ye-ib', 20], ['ye-la', 21],
        ['ye-mr', 22], ['ye-ba', 23], ['ye-dl', 24], ['ye-ja', 25],
        ['ye-sh', 26], ['ye-ma', 27], ['ye-3426', 28], ['ye-3428', 29],
        ['ye-ad', 30], ['ye-3430', 31]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ye/ye-all.topo.json">Yemen</a>'
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
