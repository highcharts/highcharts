(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-pa-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-pa-015', 10], ['us-pa-117', 11], ['us-pa-027', 12],
        ['us-pa-035', 13], ['us-pa-061', 14], ['us-pa-009', 15],
        ['us-pa-075', 16], ['us-pa-029', 17], ['us-pa-011', 18],
        ['us-pa-083', 19], ['us-pa-047', 20], ['us-pa-005', 21],
        ['us-pa-019', 22], ['us-pa-007', 23], ['us-pa-067', 24],
        ['us-pa-099', 25], ['us-pa-053', 26], ['us-pa-123', 27],
        ['us-pa-121', 28], ['us-pa-033', 29], ['us-pa-063', 30],
        ['us-pa-107', 31], ['us-pa-079', 32], ['us-pa-055', 33],
        ['us-pa-001', 34], ['us-pa-089', 35], ['us-pa-069', 36],
        ['us-pa-093', 37], ['us-pa-081', 38], ['us-pa-095', 39],
        ['us-pa-025', 40], ['us-pa-065', 41], ['us-pa-003', 42],
        ['us-pa-129', 43], ['us-pa-021', 44], ['us-pa-013', 45],
        ['us-pa-039', 46], ['us-pa-023', 47], ['us-pa-097', 48],
        ['us-pa-043', 49], ['us-pa-077', 50], ['us-pa-091', 51],
        ['us-pa-131', 52], ['us-pa-113', 53], ['us-pa-037', 54],
        ['us-pa-045', 55], ['us-pa-119', 56], ['us-pa-087', 57],
        ['us-pa-031', 58], ['us-pa-085', 59], ['us-pa-071', 60],
        ['us-pa-049', 61], ['us-pa-041', 62], ['us-pa-127', 63],
        ['us-pa-017', 64], ['us-pa-059', 65], ['us-pa-051', 66],
        ['us-pa-101', 67], ['us-pa-103', 68], ['us-pa-115', 69],
        ['us-pa-125', 70], ['us-pa-105', 71], ['us-pa-109', 72],
        ['us-pa-111', 73], ['us-pa-057', 74], ['us-pa-073', 75],
        ['us-pa-133', 76]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-pa-all.topo.json">Pennsylvania</a>'
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
