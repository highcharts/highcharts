(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-vt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-vt-3804', 10], ['no-vt-3811', 11], ['no-vt-3801', 12],
        ['no-vt-3803', 13], ['no-vt-3808', 14], ['no-vt-3822', 15],
        ['no-vt-3806', 16], ['no-vt-3823', 17], ['no-vt-3812', 18],
        ['no-vt-3825', 19], ['no-vt-3821', 20], ['no-vt-3820', 21],
        ['no-vt-3818', 22], ['no-vt-3819', 23], ['no-vt-3816', 24],
        ['no-vt-3807', 25], ['no-vt-3805', 26], ['no-vt-3817', 27],
        ['no-vt-3813', 28], ['no-vt-3814', 29], ['no-vt-3802', 30],
        ['no-vt-3815', 31], ['no-vt-3824', 32]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vt-all.topo.json">Vestfold og Telemark</a>'
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
