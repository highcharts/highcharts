(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nj-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nj-029', 10], ['us-nj-001', 11], ['us-nj-005', 12],
        ['us-nj-025', 13], ['us-nj-009', 14], ['us-nj-031', 15],
        ['us-nj-019', 16], ['us-nj-039', 17], ['us-nj-017', 18],
        ['us-nj-041', 19], ['us-nj-011', 20], ['us-nj-033', 21],
        ['us-nj-037', 22], ['us-nj-035', 23], ['us-nj-027', 24],
        ['us-nj-023', 25], ['us-nj-015', 26], ['us-nj-007', 27],
        ['us-nj-013', 28], ['us-nj-003', 29], ['us-nj-021', 30]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nj-all.topo.json">New Jersey</a>'
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
