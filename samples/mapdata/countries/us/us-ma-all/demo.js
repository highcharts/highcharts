(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ma-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ma-007', 10], ['us-ma-019', 11], ['us-ma-001', 12],
        ['us-ma-027', 13], ['us-ma-015', 14], ['us-ma-021', 15],
        ['us-ma-005', 16], ['us-ma-023', 17], ['us-ma-013', 18],
        ['us-ma-025', 19], ['us-ma-009', 20], ['us-ma-017', 21],
        ['us-ma-003', 22], ['us-ma-011', 23]
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
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-ma-all.topo.json">Massachusetts</a>'
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
