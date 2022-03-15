(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-ro-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ro-1160', 10], ['no-ro-1149', 11], ['no-ro-1144', 12],
        ['no-ro-1151', 13], ['no-ro-1142', 14], ['no-ro-1141', 15],
        ['no-ro-1145', 16], ['no-ro-1111', 17], ['no-ro-1112', 18],
        ['no-ro-1114', 19], ['no-ro-1119', 20], ['no-ro-1129', 21],
        ['no-ro-1122', 22], ['no-ro-1120', 23], ['no-ro-1124', 24],
        ['no-ro-1127', 25], ['no-ro-1106', 26], ['no-ro-1133', 27],
        ['no-ro-1134', 28], ['no-ro-1146', 29], ['no-ro-1102', 30],
        ['no-ro-1130', 31], ['no-ro-1135', 32], ['no-ro-1121', 33],
        ['no-ro-1103', 34], ['no-ro-1101', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-ro-all-2019.topo.json">Rogaland (2019)</a>'
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
