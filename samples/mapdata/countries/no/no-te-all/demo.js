(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-te-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-te-4036', 10], ['no-te-4026', 11], ['no-te-4005', 12],
        ['no-te-4024', 13], ['no-te-4022', 14], ['no-te-4028', 15],
        ['no-te-4018', 16], ['no-te-4003', 17], ['no-te-4016', 18],
        ['no-te-4032', 19], ['no-te-4034', 20], ['no-te-4010', 21],
        ['no-te-4001', 22], ['no-te-4012', 23], ['no-te-4014', 24],
        ['no-te-4030', 25], ['no-te-4020', 26]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-te-all.topo.json">Telemark</a>'
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
