(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ny-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ny-009', 10], ['us-ny-013', 11], ['us-ny-103', 12],
        ['us-ny-045', 13], ['us-ny-029', 14], ['us-ny-121', 15],
        ['us-ny-073', 16], ['us-ny-055', 17], ['us-ny-089', 18],
        ['us-ny-059', 19], ['us-ny-081', 20], ['us-ny-091', 21],
        ['us-ny-001', 22], ['us-ny-063', 23], ['us-ny-031', 24],
        ['us-ny-035', 25], ['us-ny-043', 26], ['us-ny-087', 27],
        ['us-ny-119', 28], ['us-ny-071', 29], ['us-ny-037', 30],
        ['us-ny-053', 31], ['us-ny-005', 32], ['us-ny-061', 33],
        ['us-ny-047', 34], ['us-ny-057', 35], ['us-ny-077', 36],
        ['us-ny-065', 37], ['us-ny-115', 38], ['us-ny-117', 39],
        ['us-ny-003', 40], ['us-ny-051', 41], ['us-ny-017', 42],
        ['us-ny-025', 43], ['us-ny-095', 44], ['us-ny-111', 45],
        ['us-ny-021', 46], ['us-ny-101', 47], ['us-ny-069', 48],
        ['us-ny-015', 49], ['us-ny-109', 50], ['us-ny-023', 51],
        ['us-ny-011', 52], ['us-ny-075', 53], ['us-ny-079', 54],
        ['us-ny-049', 55], ['us-ny-099', 56], ['us-ny-041', 57],
        ['us-ny-019', 58], ['us-ny-083', 59], ['us-ny-039', 60],
        ['us-ny-027', 61], ['us-ny-085', 62], ['us-ny-097', 63],
        ['us-ny-105', 64], ['us-ny-113', 65], ['us-ny-007', 66],
        ['us-ny-093', 67], ['us-ny-107', 68], ['us-ny-033', 69],
        ['us-ny-067', 70], ['us-ny-123', 71]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ny-all.topo.json">New York</a>'
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
