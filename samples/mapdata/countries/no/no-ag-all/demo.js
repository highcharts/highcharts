(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-ag-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-ag-4207', 10], ['no-ag-4201', 11], ['no-ag-4217', 12],
        ['no-ag-4203', 13], ['no-ag-4222', 14], ['no-ag-4219', 15],
        ['no-ag-4224', 16], ['no-ag-4202', 17], ['no-ag-4228', 18],
        ['no-ag-4225', 19], ['no-ag-4205', 20], ['no-ag-4227', 21],
        ['no-ag-4214', 22], ['no-ag-4204', 23], ['no-ag-4216', 24],
        ['no-ag-4226', 25], ['no-ag-4223', 26], ['no-ag-4220', 27],
        ['no-ag-4218', 28], ['no-ag-4213', 29], ['no-ag-4211', 30],
        ['no-ag-4206', 31], ['no-ag-4212', 32], ['no-ag-4215', 33],
        ['no-ag-4221', 34]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-ag-all.topo.json">Agder</a>'
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
