(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-of-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-of-3122', 10], ['no-of-3124', 11], ['no-of-3101', 12],
        ['no-of-3110', 13], ['no-of-3107', 14], ['no-of-3105', 15],
        ['no-of-3120', 16], ['no-of-3116', 17], ['no-of-3114', 18],
        ['no-of-3112', 19], ['no-of-3118', 20], ['no-of-3103', 21]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-of-all.topo.json">Østfold</a>'
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
