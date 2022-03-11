(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nm-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nm-031', 10], ['us-nm-043', 11], ['us-nm-045', 12],
        ['us-nm-049', 13], ['us-nm-006', 14], ['us-nm-028', 15],
        ['us-nm-047', 16], ['us-nm-001', 17], ['us-nm-023', 18],
        ['us-nm-013', 19], ['us-nm-009', 20], ['us-nm-007', 21],
        ['us-nm-025', 22], ['us-nm-033', 23], ['us-nm-041', 24],
        ['us-nm-011', 25], ['us-nm-003', 26], ['us-nm-029', 27],
        ['us-nm-017', 28], ['us-nm-039', 29], ['us-nm-061', 30],
        ['us-nm-055', 31], ['us-nm-005', 32], ['us-nm-027', 33],
        ['us-nm-053', 34], ['us-nm-057', 35], ['us-nm-037', 36],
        ['us-nm-021', 37], ['us-nm-035', 38], ['us-nm-019', 39],
        ['us-nm-059', 40], ['us-nm-051', 41], ['us-nm-015', 42]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nm-all.topo.json">New Mexico</a>'
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
