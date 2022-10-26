(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pw/pw-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pw-6740', 10], ['pw-6753', 11], ['pw-6742', 12], ['pw-6741', 13],
        ['pw-6743', 14], ['pw-6747', 15], ['pw-6749', 16], ['pw-6751', 17],
        ['pw-6752', 18], ['pw-6746', 19], ['pw-6744', 20], ['pw-6748', 21],
        ['pw-6745', 22], ['pw-6750', 23], ['pw-6739', 24], ['pw-3596', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pw/pw-all.topo.json">Palau</a>'
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
