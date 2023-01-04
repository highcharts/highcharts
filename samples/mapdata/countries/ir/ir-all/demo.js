(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/ir/ir-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['ir-5428', 10], ['ir-hg', 11], ['ir-bs', 12], ['ir-kb', 13],
        ['ir-fa', 14], ['ir-es', 15], ['ir-sm', 16], ['ir-go', 17],
        ['ir-mn', 18], ['ir-th', 19], ['ir-mk', 20], ['ir-ya', 21],
        ['ir-cm', 22], ['ir-kz', 23], ['ir-lo', 24], ['ir-il', 25],
        ['ir-ar', 26], ['ir-qm', 27], ['ir-hd', 28], ['ir-za', 29],
        ['ir-qz', 30], ['ir-wa', 31], ['ir-ea', 32], ['ir-bk', 33],
        ['ir-gi', 34], ['ir-kd', 35], ['ir-kj', 36], ['ir-kv', 37],
        ['ir-ks', 38], ['ir-sb', 39], ['ir-ke', 40], ['ir-al', 41]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ir/ir-all.topo.json">Iran</a>'
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
