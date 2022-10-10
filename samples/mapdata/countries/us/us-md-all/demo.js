(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-md-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-md-047', 10], ['us-md-039', 11], ['us-md-037', 12],
        ['us-md-019', 13], ['us-md-027', 14], ['us-md-021', 15],
        ['us-md-031', 16], ['us-md-023', 17], ['us-md-003', 18],
        ['us-md-033', 19], ['us-md-017', 20], ['us-md-510', 21],
        ['us-md-005', 22], ['us-md-001', 23], ['us-md-043', 24],
        ['us-md-035', 25], ['us-md-041', 26], ['us-md-011', 27],
        ['us-md-045', 28], ['us-md-013', 29], ['us-md-015', 30],
        ['us-md-029', 31], ['us-md-009', 32], ['us-md-025', 33]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-md-all.topo.json">Maryland</a>'
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
