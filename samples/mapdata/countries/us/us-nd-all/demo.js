(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nd-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nd-087', 10], ['us-nd-079', 11], ['us-nd-013', 12],
        ['us-nd-075', 13], ['us-nd-099', 14], ['us-nd-035', 15],
        ['us-nd-019', 16], ['us-nd-063', 17], ['us-nd-067', 18],
        ['us-nd-015', 19], ['us-nd-091', 20], ['us-nd-005', 21],
        ['us-nd-095', 22], ['us-nd-069', 23], ['us-nd-057', 24],
        ['us-nd-025', 25], ['us-nd-103', 26], ['us-nd-093', 27],
        ['us-nd-027', 28], ['us-nd-033', 29], ['us-nd-053', 30],
        ['us-nd-007', 31], ['us-nd-039', 32], ['us-nd-105', 33],
        ['us-nd-003', 34], ['us-nd-045', 35], ['us-nd-051', 36],
        ['us-nd-059', 37], ['us-nd-089', 38], ['us-nd-021', 39],
        ['us-nd-073', 40], ['us-nd-049', 41], ['us-nd-083', 42],
        ['us-nd-043', 43], ['us-nd-037', 44], ['us-nd-001', 45],
        ['us-nd-023', 46], ['us-nd-055', 47], ['us-nd-101', 48],
        ['us-nd-081', 49], ['us-nd-009', 50], ['us-nd-029', 51],
        ['us-nd-017', 52], ['us-nd-047', 53], ['us-nd-097', 54],
        ['us-nd-065', 55], ['us-nd-071', 56], ['us-nd-077', 57],
        ['us-nd-011', 58], ['us-nd-031', 59], ['us-nd-041', 60],
        ['us-nd-085', 61], ['us-nd-061', 62]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nd-all.topo.json">North Dakota</a>'
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
