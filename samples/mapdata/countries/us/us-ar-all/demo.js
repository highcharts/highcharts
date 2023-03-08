(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ar-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ar-073', 10], ['us-ar-057', 11], ['us-ar-037', 12],
        ['us-ar-147', 13], ['us-ar-049', 14], ['us-ar-065', 15],
        ['us-ar-045', 16], ['us-ar-141', 17], ['us-ar-023', 18],
        ['us-ar-015', 19], ['us-ar-101', 20], ['us-ar-115', 21],
        ['us-ar-005', 22], ['us-ar-051', 23], ['us-ar-105', 24],
        ['us-ar-063', 25], ['us-ar-145', 26], ['us-ar-043', 27],
        ['us-ar-003', 28], ['us-ar-127', 29], ['us-ar-129', 30],
        ['us-ar-061', 31], ['us-ar-071', 32], ['us-ar-087', 33],
        ['us-ar-095', 34], ['us-ar-123', 35], ['us-ar-019', 36],
        ['us-ar-097', 37], ['us-ar-149', 38], ['us-ar-013', 39],
        ['us-ar-025', 40], ['us-ar-031', 41], ['us-ar-067', 42],
        ['us-ar-099', 43], ['us-ar-011', 44], ['us-ar-053', 45],
        ['us-ar-119', 46], ['us-ar-001', 47], ['us-ar-107', 48],
        ['us-ar-085', 49], ['us-ar-117', 50], ['us-ar-075', 51],
        ['us-ar-135', 52], ['us-ar-059', 53], ['us-ar-029', 54],
        ['us-ar-007', 55], ['us-ar-035', 56], ['us-ar-093', 57],
        ['us-ar-111', 58], ['us-ar-083', 59], ['us-ar-047', 60],
        ['us-ar-041', 61], ['us-ar-079', 62], ['us-ar-009', 63],
        ['us-ar-033', 64], ['us-ar-109', 65], ['us-ar-121', 66],
        ['us-ar-055', 67], ['us-ar-081', 68], ['us-ar-139', 69],
        ['us-ar-089', 70], ['us-ar-113', 71], ['us-ar-133', 72],
        ['us-ar-027', 73], ['us-ar-069', 74], ['us-ar-131', 75],
        ['us-ar-021', 76], ['us-ar-137', 77], ['us-ar-125', 78],
        ['us-ar-091', 79], ['us-ar-143', 80], ['us-ar-103', 81],
        ['us-ar-039', 82], ['us-ar-077', 83], ['us-ar-017', 84]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ar-all.topo.json">Arkansas</a>'
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
