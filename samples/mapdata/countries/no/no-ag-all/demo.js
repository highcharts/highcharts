(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-ag-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ag-4207', 10], ['no-ag-4228', 11], ['no-ag-4227', 12],
        ['no-ag-4224', 13], ['no-ag-4223', 14], ['no-ag-4206', 15],
        ['no-ag-4226', 16], ['no-ag-4201', 17], ['no-ag-4213', 18],
        ['no-ag-4222', 19], ['no-ag-4221', 20], ['no-ag-4220', 21],
        ['no-ag-4217', 22], ['no-ag-4219', 23], ['no-ag-4218', 24],
        ['no-ag-4216', 25], ['no-ag-4215', 26], ['no-ag-4202', 27],
        ['no-ag-4203', 28], ['no-ag-4212', 29], ['no-ag-4211', 30],
        ['no-ag-4214', 31], ['no-ag-4225', 32], ['no-ag-4204', 33],
        ['no-ag-4205', 34]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-ag-all.topo.json">Agder</a>'
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
