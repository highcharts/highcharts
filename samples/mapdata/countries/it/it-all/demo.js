(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/it/it-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['it-82', 10], ['it-75', 11], ['it-77', 12], ['it-72', 13],
        ['it-62', 14], ['it-67', 15], ['it-52', 16], ['it-55', 17],
        ['it-45', 18], ['it-34', 19], ['it-21', 20], ['it-25', 21],
        ['it-23', 22], ['it-32', 23], ['it-57', 24], ['it-65', 25],
        ['it-36', 26], ['it-42', 27], ['it-78', 28], ['it-88', 29]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/it/it-all.topo.json">Italy</a>'
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
