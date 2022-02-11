(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-vl-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-vl-4625', 10], ['no-vl-4633', 11], ['no-vl-4645', 12],
        ['no-vl-4611', 13], ['no-vl-4612', 14], ['no-vl-4650', 15],
        ['no-vl-4615', 16], ['no-vl-4613', 17], ['no-vl-4617', 18],
        ['no-vl-4616', 19], ['no-vl-4619', 20], ['no-vl-4620', 21],
        ['no-vl-4622', 22], ['no-vl-4624', 23], ['no-vl-4623', 24],
        ['no-vl-4634', 25], ['no-vl-4614', 26], ['no-vl-4639', 27],
        ['no-vl-4641', 28], ['no-vl-4630', 29], ['no-vl-4621', 30],
        ['no-vl-4631', 31], ['no-vl-4626', 32], ['no-vl-4636', 33],
        ['no-vl-4637', 34], ['no-vl-4618', 35], ['no-vl-4629', 36],
        ['no-vl-4627', 37], ['no-vl-4649', 38], ['no-vl-4602', 39],
        ['no-vl-4646', 40], ['no-vl-4647', 41], ['no-vl-4640', 42],
        ['no-vl-4642', 43], ['no-vl-4644', 44], ['no-vl-4643', 45],
        ['no-vl-4628', 46], ['no-vl-4601', 47], ['no-vl-4651', 48],
        ['no-vl-4648', 49], ['no-vl-4632', 50], ['no-vl-4638', 51],
        ['no-vl-4635', 52]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vl-all.topo.json">Vestland</a>'
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
