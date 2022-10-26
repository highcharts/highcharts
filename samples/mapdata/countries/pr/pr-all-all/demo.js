(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/pr/pr-all-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['pr-3614-115', 10], ['pr-3614-095', 11], ['pr-3614-017', 12],
        ['pr-3614-054', 13], ['pr-3614-027', 14], ['pr-3614-067', 15],
        ['pr-3614-079', 16], ['pr-3614-121', 17], ['pr-3614-081', 18],
        ['pr-3614-153', 19], ['pr-3614-093', 20], ['pr-3614-001', 21],
        ['pr-3614-113', 22], ['pr-3614-137', 23], ['pr-3614-021', 24],
        ['pr-3614-097', 25], ['pr-3614-023', 26], ['pr-3614-019', 27],
        ['pr-3614-047', 28], ['pr-3614-073', 29], ['pr-3614-107', 30],
        ['pr-3614-085', 31], ['pr-3614-129', 32], ['pr-3614-151', 33],
        ['pr-3614-109', 34], ['pr-3614-003', 35], ['pr-3614-011', 36],
        ['pr-3614-009', 37], ['pr-3614-041', 38], ['pr-3614-135', 39],
        ['pr-3614-143', 40], ['pr-3614-141', 41], ['pr-3614-039', 42],
        ['pr-3614-013', 43], ['pr-3614-061', 44], ['pr-3614-035', 45],
        ['pr-3614-015', 46], ['pr-3614-125', 47], ['pr-3614-031', 48],
        ['pr-3614-063', 49], ['pr-3614-139', 50], ['pr-3614-025', 51],
        ['pr-3614-119', 52], ['pr-3614-075', 53], ['pr-3614-045', 54],
        ['pr-3614-127', 55], ['pr-3614-007', 56], ['pr-3614-033', 57],
        ['pr-3614-091', 58], ['pr-3614-101', 59], ['pr-3614-059', 60],
        ['pr-3614-055', 61], ['pr-3614-131', 62], ['pr-3614-037', 63],
        ['pr-3614-089', 64], ['pr-3614-053', 65], ['pr-3614-049', 66],
        ['pr-3614-051', 67], ['pr-3614-133', 68], ['pr-3614-123', 69],
        ['pr-3614-005', 70], ['pr-3614-111', 71], ['pr-3614-117', 72],
        ['pr-3614-145', 73], ['pr-3614-069', 74], ['pr-3614-147', 75],
        ['pr-3614-087', 76], ['pr-3614-065', 77], ['pr-3614-057', 78],
        ['pr-3614-071', 79], ['pr-3614-099', 80], ['pr-3614-083', 81],
        ['pr-3614-077', 82], ['pr-3614-029', 83], ['pr-3614-103', 84],
        ['pr-3614-043', 85], ['pr-3614-105', 86], ['pr-3614-149', 87]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pr/pr-all-all.topo.json">Puerto Rico</a>'
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
