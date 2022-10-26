(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-wa-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-wa-075', 10], ['us-wa-043', 11], ['us-wa-069', 12],
        ['us-wa-057', 13], ['us-wa-053', 14], ['us-wa-031', 15],
        ['us-wa-067', 16], ['us-wa-027', 17], ['us-wa-065', 18],
        ['us-wa-073', 19], ['us-wa-047', 20], ['us-wa-049', 21],
        ['us-wa-055', 22], ['us-wa-019', 23], ['us-wa-021', 24],
        ['us-wa-001', 25], ['us-wa-003', 26], ['us-wa-035', 27],
        ['us-wa-045', 28], ['us-wa-041', 29], ['us-wa-013', 30],
        ['us-wa-029', 31], ['us-wa-011', 32], ['us-wa-037', 33],
        ['us-wa-017', 34], ['us-wa-023', 35], ['us-wa-015', 36],
        ['us-wa-071', 37], ['us-wa-005', 38], ['us-wa-061', 39],
        ['us-wa-007', 40], ['us-wa-033', 41], ['us-wa-025', 42],
        ['us-wa-063', 43], ['us-wa-051', 44], ['us-wa-009', 45],
        ['us-wa-059', 46], ['us-wa-039', 47], ['us-wa-077', 48]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wa-all.topo.json">Washington</a>'
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
