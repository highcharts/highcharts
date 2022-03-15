(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nh-015', 10], ['us-nh-013', 11], ['us-nh-003', 12],
        ['us-nh-001', 13], ['us-nh-009', 14], ['us-nh-005', 15],
        ['us-nh-007', 16], ['us-nh-017', 17], ['us-nh-019', 18],
        ['us-nh-011', 19]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nh-all.topo.json">New Hampshire</a>'
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
