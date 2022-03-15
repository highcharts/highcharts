(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-wy-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-wy-011', 10], ['us-wy-023', 11], ['us-wy-037', 12],
        ['us-wy-039', 13], ['us-wy-005', 14], ['us-wy-027', 15],
        ['us-wy-009', 16], ['us-wy-045', 17], ['us-wy-031', 18],
        ['us-wy-021', 19], ['us-wy-019', 20], ['us-wy-043', 21],
        ['us-wy-033', 22], ['us-wy-029', 23], ['us-wy-013', 24],
        ['us-wy-007', 25], ['us-wy-001', 26], ['us-wy-035', 27],
        ['us-wy-041', 28], ['us-wy-025', 29], ['us-wy-015', 30],
        ['us-wy-017', 31], ['us-wy-003', 32]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wy-all.topo.json">Wyoming</a>'
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
