(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kv/kv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['kv-841', 10], ['kv-7318', 11], ['kv-7319', 12], ['kv-7320', 13],
        ['kv-7321', 14], ['kv-7322', 15], ['kv-844', 16], ['kv-7302', 17],
        ['kv-7303', 18], ['kv-7304', 19], ['kv-7305', 20], ['kv-7306', 21],
        ['kv-845', 22], ['kv-7307', 23], ['kv-7308', 24], ['kv-7309', 25],
        ['kv-7310', 26], ['kv-7311', 27], ['kv-842', 28], ['kv-7312', 29],
        ['kv-7313', 30], ['kv-7314', 31], ['kv-843', 32], ['kv-7315', 33],
        ['kv-7316', 34], ['kv-7317', 35], ['kv-7323', 36], ['kv-7324', 37],
        ['kv-7325', 38], ['kv-7326', 39]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kv/kv-all.topo.json">Kosovo</a>'
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
