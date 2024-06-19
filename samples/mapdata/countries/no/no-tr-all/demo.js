(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/no/no-tr-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-tr-5544', 10], ['no-tr-5546', 11], ['no-tr-5542', 12],
        ['no-tr-5540', 13], ['no-tr-5538', 14], ['no-tr-5536', 15],
        ['no-tr-5534', 16], ['no-tr-5501', 17], ['no-tr-5532', 18],
        ['no-tr-5524', 19], ['no-tr-5520', 20], ['no-tr-5526', 21],
        ['no-tr-5528', 22], ['no-tr-5522', 23], ['no-tr-5518', 24],
        ['no-tr-5516', 25], ['no-tr-5503', 26], ['no-tr-5510', 27],
        ['no-tr-5514', 28], ['no-tr-5512', 29], ['no-tr-5530', 30]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-tr-all.topo.json">Troms</a>'
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
