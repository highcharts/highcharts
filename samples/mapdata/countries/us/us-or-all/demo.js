(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-or-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-or-057', 10], ['us-or-055', 11], ['us-or-035', 12],
        ['us-or-029', 13], ['us-or-047', 14], ['us-or-071', 15],
        ['us-or-013', 16], ['us-or-025', 17], ['us-or-053', 18],
        ['us-or-041', 19], ['us-or-065', 20], ['us-or-045', 21],
        ['us-or-049', 22], ['us-or-023', 23], ['us-or-061', 24],
        ['us-or-063', 25], ['us-or-001', 26], ['us-or-031', 27],
        ['us-or-019', 28], ['us-or-033', 29], ['us-or-005', 30],
        ['us-or-011', 31], ['us-or-051', 32], ['us-or-037', 33],
        ['us-or-069', 34], ['us-or-067', 35], ['us-or-015', 36],
        ['us-or-059', 37], ['us-or-007', 38], ['us-or-027', 39],
        ['us-or-039', 40], ['us-or-009', 41], ['us-or-043', 42],
        ['us-or-003', 43], ['us-or-017', 44], ['us-or-021', 45]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-or-all.topo.json">Oregon</a>'
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
