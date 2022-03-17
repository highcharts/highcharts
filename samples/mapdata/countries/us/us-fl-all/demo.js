(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-fl-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-fl-131', 10], ['us-fl-087', 11], ['us-fl-053', 12],
        ['us-fl-051', 13], ['us-fl-043', 14], ['us-fl-086', 15],
        ['us-fl-037', 16], ['us-fl-097', 17], ['us-fl-093', 18],
        ['us-fl-071', 19], ['us-fl-111', 20], ['us-fl-061', 21],
        ['us-fl-085', 22], ['us-fl-021', 23], ['us-fl-049', 24],
        ['us-fl-055', 25], ['us-fl-027', 26], ['us-fl-015', 27],
        ['us-fl-009', 28], ['us-fl-095', 29], ['us-fl-129', 30],
        ['us-fl-133', 31], ['us-fl-005', 32], ['us-fl-007', 33],
        ['us-fl-107', 34], ['us-fl-031', 35], ['us-fl-003', 36],
        ['us-fl-019', 37], ['us-fl-063', 38], ['us-fl-103', 39],
        ['us-fl-057', 40], ['us-fl-035', 41], ['us-fl-045', 42],
        ['us-fl-065', 43], ['us-fl-081', 44], ['us-fl-101', 45],
        ['us-fl-115', 46], ['us-fl-073', 47], ['us-fl-033', 48],
        ['us-fl-113', 49], ['us-fl-011', 50], ['us-fl-089', 51],
        ['us-fl-077', 52], ['us-fl-105', 53], ['us-fl-041', 54],
        ['us-fl-067', 55], ['us-fl-127', 56], ['us-fl-121', 57],
        ['us-fl-083', 58], ['us-fl-017', 59], ['us-fl-075', 60],
        ['us-fl-059', 61], ['us-fl-079', 62], ['us-fl-029', 63],
        ['us-fl-117', 64], ['us-fl-069', 65], ['us-fl-091', 66],
        ['us-fl-001', 67], ['us-fl-125', 68], ['us-fl-013', 69],
        ['us-fl-123', 70], ['us-fl-119', 71], ['us-fl-109', 72],
        ['us-fl-099', 73], ['us-fl-047', 74], ['us-fl-023', 75],
        ['us-fl-039', 76]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-fl-all.topo.json">Florida</a>'
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
