(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-mt-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-mt-005', 10], ['us-mt-041', 11], ['us-mt-105', 12],
        ['us-mt-019', 13], ['us-mt-051', 14], ['us-mt-071', 15],
        ['us-mt-027', 16], ['us-mt-037', 17], ['us-mt-065', 18],
        ['us-mt-101', 19], ['us-mt-015', 20], ['us-mt-013', 21],
        ['us-mt-097', 22], ['us-mt-059', 23], ['us-mt-039', 24],
        ['us-mt-023', 25], ['us-mt-001', 26], ['us-mt-057', 27],
        ['us-mt-053', 28], ['us-mt-029', 29], ['us-mt-063', 30],
        ['us-mt-095', 31], ['us-mt-089', 32], ['us-mt-077', 33],
        ['us-mt-043', 34], ['us-mt-031', 35], ['us-mt-075', 36],
        ['us-mt-003', 37], ['us-mt-033', 38], ['us-mt-017', 39],
        ['us-mt-067', 40], ['us-mt-009', 41], ['us-mt-111', 42],
        ['us-mt-087', 43], ['us-mt-081', 44], ['us-mt-085', 45],
        ['us-mt-107', 46], ['us-mt-109', 47], ['us-mt-079', 48],
        ['us-mt-099', 49], ['us-mt-073', 50], ['us-mt-021', 51],
        ['us-mt-083', 52], ['us-mt-055', 53], ['us-mt-061', 54],
        ['us-mt-035', 55], ['us-mt-047', 56], ['us-mt-049', 57],
        ['us-mt-093', 58], ['us-mt-091', 59], ['us-mt-007', 60],
        ['us-mt-011', 61], ['us-mt-025', 62], ['us-mt-103', 63],
        ['us-mt-069', 64], ['us-mt-045', 65]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mt-all.topo.json">Montana</a>'
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
