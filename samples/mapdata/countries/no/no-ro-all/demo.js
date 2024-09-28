(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-ro-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ro-1127', 10], ['no-ro-1124', 11], ['no-ro-1120', 12],
        ['no-ro-1130', 13], ['no-ro-1121', 14], ['no-ro-1119', 15],
        ['no-ro-1111', 16], ['no-ro-1112', 17], ['no-ro-1101', 18],
        ['no-ro-1114', 19], ['no-ro-1122', 20], ['no-ro-1133', 21],
        ['no-ro-1134', 22], ['no-ro-1149', 23], ['no-ro-1145', 24],
        ['no-ro-1106', 25], ['no-ro-1146', 26], ['no-ro-1135', 27],
        ['no-ro-1160', 28], ['no-ro-1103', 29], ['no-ro-1108', 30]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ro-all.topo.json">Rogaland</a>'
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
