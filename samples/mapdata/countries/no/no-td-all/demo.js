(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-td-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-td-5014', 10], ['no-td-5020', 11], ['no-td-5054', 12],
        ['no-td-5022', 13], ['no-td-5021', 14], ['no-td-5027', 15],
        ['no-td-5026', 16], ['no-td-5025', 17], ['no-td-5033', 18],
        ['no-td-5032', 19], ['no-td-5028', 20], ['no-td-5029', 21],
        ['no-td-5031', 22], ['no-td-5061', 23], ['no-td-5052', 24],
        ['no-td-5046', 25], ['no-td-5044', 26], ['no-td-5043', 27],
        ['no-td-5047', 28], ['no-td-5045', 29], ['no-td-5042', 30],
        ['no-td-5049', 31], ['no-td-5041', 32], ['no-td-5038', 33],
        ['no-td-5036', 34], ['no-td-5037', 35], ['no-td-5035', 36],
        ['no-td-5034', 37], ['no-td-5053', 38], ['no-td-5060', 39],
        ['no-td-5007', 40], ['no-td-5058', 41], ['no-td-5006', 42],
        ['no-td-5057', 43], ['no-td-5056', 44], ['no-td-5055', 45],
        ['no-td-5059', 46], ['no-td-5001', 47]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-td-all.topo.json">Trøndelag</a>'
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
