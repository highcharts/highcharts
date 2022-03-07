(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/benelux.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['nl-nh', 10], ['nl-fr', 11], ['be-bu', 12], ['nl-gr', 13],
        ['nl-fl', 14], ['nl-ze', 15], ['be-3528', 16], ['be-3529', 17],
        ['be-489', 18], ['lu-di', 19], ['lu-gr', 20], ['lu-lu', 21],
        ['nl-nb', 22], ['nl-ut', 23], ['nl-zh', 24], ['nl-dr', 25],
        ['nl-ge', 26], ['nl-li', 27], ['be-vb', 28], ['be-490', 29],
        ['nl-ov', 30], ['be-3526', 31], ['be-3527', 32], ['be-3535', 33],
        ['be-ov', 34], ['be-3534', 35], [null, 36]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/benelux.topo.json">Benelux</a>'
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
