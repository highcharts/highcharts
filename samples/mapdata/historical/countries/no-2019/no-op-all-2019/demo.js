(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/historical/countries/no-2019/no-op-all-2019.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['no-op-522', 10], ['no-op-542', 11], ['no-op-513', 12],
        ['no-op-519', 13], ['no-op-517', 14], ['no-op-543', 15],
        ['no-op-515', 16], ['no-op-544', 17], ['no-op-511', 18],
        ['no-op-516', 19], ['no-op-541', 20], ['no-op-545', 21],
        ['no-op-520', 22], ['no-op-532', 23], ['no-op-529', 24],
        ['no-op-502', 25], ['no-op-538', 26], ['no-op-501', 27],
        ['no-op-528', 28], ['no-op-521', 29], ['no-op-534', 30],
        ['no-op-533', 31], ['no-op-512', 32], ['no-op-540', 33],
        ['no-op-514', 34], ['no-op-536', 35]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/no-2019/no-op-all-2019.topo.json">Oppland (2019)</a>'
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
