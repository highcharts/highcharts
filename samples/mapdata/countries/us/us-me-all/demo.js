(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-me-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-me-009', 10], ['us-me-029', 11], ['us-me-013', 12],
        ['us-me-027', 13], ['us-me-015', 14], ['us-me-019', 15],
        ['us-me-031', 16], ['us-me-005', 17], ['us-me-025', 18],
        ['us-me-021', 19], ['us-me-023', 20], ['us-me-001', 21],
        ['us-me-007', 22], ['us-me-003', 23], ['us-me-011', 24],
        ['us-me-017', 25]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-me-all.topo.json">Maine</a>'
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
