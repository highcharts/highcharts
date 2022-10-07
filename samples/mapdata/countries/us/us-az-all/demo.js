(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-az-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-az-011', 10], ['us-az-001', 11], ['us-az-003', 12],
        ['us-az-012', 13], ['us-az-013', 14], ['us-az-005', 15],
        ['us-az-007', 16], ['us-az-021', 17], ['us-az-009', 18],
        ['us-az-015', 19], ['us-az-017', 20], ['us-az-027', 21],
        ['us-az-023', 22], ['us-az-025', 23], ['us-az-019', 24]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-az-all.topo.json">Arizona</a>'
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
