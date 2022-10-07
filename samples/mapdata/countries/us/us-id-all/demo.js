(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-id-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-id-073', 10], ['us-id-057', 11], ['us-id-001', 12],
        ['us-id-083', 13], ['us-id-071', 14], ['us-id-031', 15],
        ['us-id-035', 16], ['us-id-077', 17], ['us-id-011', 18],
        ['us-id-029', 19], ['us-id-065', 20], ['us-id-051', 21],
        ['us-id-019', 22], ['us-id-033', 23], ['us-id-055', 24],
        ['us-id-009', 25], ['us-id-021', 26], ['us-id-085', 27],
        ['us-id-059', 28], ['us-id-027', 29], ['us-id-061', 30],
        ['us-id-043', 31], ['us-id-015', 32], ['us-id-087', 33],
        ['us-id-037', 34], ['us-id-003', 35], ['us-id-039', 36],
        ['us-id-025', 37], ['us-id-049', 38], ['us-id-045', 39],
        ['us-id-013', 40], ['us-id-069', 41], ['us-id-023', 42],
        ['us-id-005', 43], ['us-id-007', 44], ['us-id-063', 45],
        ['us-id-075', 46], ['us-id-067', 47], ['us-id-079', 48],
        ['us-id-053', 49], ['us-id-041', 50], ['us-id-081', 51],
        ['us-id-017', 52], ['us-id-047', 53]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-id-all.topo.json">Idaho</a>'
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
