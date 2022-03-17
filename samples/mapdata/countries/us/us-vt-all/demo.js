(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-vt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-vt-013', 10], ['us-vt-009', 11], ['us-vt-011', 12],
        ['us-vt-007', 13], ['us-vt-015', 14], ['us-vt-021', 15],
        ['us-vt-003', 16], ['us-vt-017', 17], ['us-vt-027', 18],
        ['us-vt-005', 19], ['us-vt-019', 20], ['us-vt-025', 21],
        ['us-vt-001', 22], ['us-vt-023', 23]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-vt-all.topo.json">Vermont</a>'
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
