(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ut-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ut-003', 10], ['us-ut-039', 11], ['us-ut-027', 12],
        ['us-ut-037', 13], ['us-ut-005', 14], ['us-ut-055', 15],
        ['us-ut-023', 16], ['us-ut-033', 17], ['us-ut-013', 18],
        ['us-ut-047', 19], ['us-ut-015', 20], ['us-ut-049', 21],
        ['us-ut-035', 22], ['us-ut-043', 23], ['us-ut-041', 24],
        ['us-ut-007', 25], ['us-ut-031', 26], ['us-ut-009', 27],
        ['us-ut-017', 28], ['us-ut-051', 29], ['us-ut-001', 30],
        ['us-ut-057', 31], ['us-ut-029', 32], ['us-ut-053', 33],
        ['us-ut-021', 34], ['us-ut-011', 35], ['us-ut-025', 36],
        ['us-ut-019', 37], ['us-ut-045', 38]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ut-all.topo.json">Utah</a>'
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
