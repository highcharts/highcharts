(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nv-005', 10], ['us-nv-013', 11], ['us-nv-021', 12],
        ['us-nv-023', 13], ['us-nv-011', 14], ['us-nv-017', 15],
        ['us-nv-003', 16], ['us-nv-015', 17], ['us-nv-027', 18],
        ['us-nv-007', 19], ['us-nv-510', 20], ['us-nv-019', 21],
        ['us-nv-029', 22], ['us-nv-033', 23], ['us-nv-009', 24],
        ['us-nv-031', 25], ['us-nv-001', 26]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nv-all.topo.json">Nevada</a>'
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
