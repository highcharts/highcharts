(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ye/ye-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ye-hu', 10], ['ye-3415', 11], ['ye-3427', 12], ['ye-ta', 13],
        ['ye-sd', 14], ['ye-mw', 15], ['ye-dh', 16], ['ye-hj', 17],
        ['ye-am', 18], ['ye-ib', 19], ['ye-la', 20], ['ye-mr', 21],
        ['ye-ba', 22], ['ye-dl', 23], ['ye-ja', 24], ['ye-sh', 25],
        ['ye-ma', 26], ['ye-3426', 27], ['ye-3428', 28], ['ye-ad', 29],
        ['ye-3430', 30]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ye/ye-all.topo.json">Yemen</a>'
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
