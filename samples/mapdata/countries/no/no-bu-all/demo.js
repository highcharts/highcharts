(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-bu-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-bu-3312', 10], ['no-bu-3310', 11], ['no-bu-3303', 12],
        ['no-bu-3314', 13], ['no-bu-3334', 14], ['no-bu-3336', 15],
        ['no-bu-3338', 16], ['no-bu-3330', 17], ['no-bu-3328', 18],
        ['no-bu-3326', 19], ['no-bu-3324', 20], ['no-bu-3322', 21],
        ['no-bu-3320', 22], ['no-bu-3305', 23], ['no-bu-3318', 24],
        ['no-bu-3332', 25], ['no-bu-3316', 26], ['no-bu-3301', 27]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-bu-all.topo.json">Buskerud</a>'
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
