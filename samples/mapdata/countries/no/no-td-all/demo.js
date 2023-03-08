(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-td-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-td-5058', 10], ['no-td-5057', 11], ['no-td-5014', 12],
        ['no-td-5031', 13], ['no-td-5049', 14], ['no-td-5056', 15],
        ['no-td-5034', 16], ['no-td-5032', 17], ['no-td-5054', 18],
        ['no-td-5059', 19], ['no-mr-5061', 20], ['no-td-5022', 21],
        ['no-td-5037', 22], ['no-td-5035', 23], ['no-td-5053', 24],
        ['no-td-5038', 25], ['no-td-5028', 26], ['no-td-5045', 27],
        ['no-td-5042', 28], ['no-td-5001', 29], ['no-td-5027', 30],
        ['no-mr-5055', 31], ['no-td-5047', 32], ['no-td-5006', 33],
        ['no-td-5052', 34], ['no-td-5020', 35], ['no-td-5026', 36],
        ['no-td-5041', 37], ['no-td-5044', 38], ['no-td-5025', 39],
        ['no-td-5033', 40], ['no-td-5043', 41], ['no-td-5036', 42],
        ['no-td-5021', 43], ['no-td-5029', 44], ['no-td-5060', 45],
        ['no-td-5007', 46], ['no-td-5046', 47]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-td-all.topo.json">Trøndelag</a>'
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
