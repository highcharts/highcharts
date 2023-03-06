(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-tf-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-tf-5429', 10], ['no-tf-5427', 11], ['no-tf-5401', 12],
        ['no-tf-5402', 13], ['no-tf-5434', 14], ['no-tf-5432', 15],
        ['no-tf-5436', 16], ['no-tf-5444', 17], ['no-tf-5419', 18],
        ['no-tf-5424', 19], ['no-tf-5423', 20], ['no-tf-5404', 21],
        ['no-tf-5414', 22], ['no-tf-5413', 23], ['no-tf-5442', 24],
        ['no-tf-5441', 25], ['no-tf-5420', 26], ['no-tf-5435', 27],
        ['no-tf-5433', 28], ['no-tf-5415', 29], ['no-tf-5416', 30],
        ['no-tf-5403', 31], ['no-tf-5437', 32], ['no-tf-5417', 33],
        ['no-tf-5421', 34], ['no-tf-5425', 35], ['no-tf-5418', 36],
        ['no-tf-5428', 37], ['no-tf-5426', 38], ['no-tf-5412', 39],
        ['no-tf-5406', 40], ['no-tf-5430', 41], ['no-tf-5438', 42],
        ['no-tf-5411', 43], ['no-tf-5440', 44], ['no-tf-5439', 45],
        ['no-tf-5443', 46], ['no-tf-5422', 47], ['no-tf-5405', 48]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-tf-all.topo.json">Troms og Finnmark</a>'
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
