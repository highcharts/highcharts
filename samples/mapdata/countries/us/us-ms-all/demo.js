(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ms-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ms-005', 10], ['us-ms-037', 11], ['us-ms-107', 12],
        ['us-ms-143', 13], ['us-ms-119', 14], ['us-ms-161', 15],
        ['us-ms-111', 16], ['us-ms-041', 17], ['us-ms-053', 18],
        ['us-ms-125', 19], ['us-ms-047', 20], ['us-ms-059', 21],
        ['us-ms-159', 22], ['us-ms-007', 23], ['us-ms-127', 24],
        ['us-ms-121', 25], ['us-ms-011', 26], ['us-ms-027', 27],
        ['us-ms-139', 28], ['us-ms-117', 29], ['us-ms-003', 30],
        ['us-ms-109', 31], ['us-ms-035', 32], ['us-ms-113', 33],
        ['us-ms-147', 34], ['us-ms-103', 35], ['us-ms-105', 36],
        ['us-ms-135', 37], ['us-ms-021', 38], ['us-ms-149', 39],
        ['us-ms-155', 40], ['us-ms-077', 41], ['us-ms-029', 42],
        ['us-ms-115', 43], ['us-ms-071', 44], ['us-ms-033', 45],
        ['us-ms-137', 46], ['us-ms-039', 47], ['us-ms-019', 48],
        ['us-ms-141', 49], ['us-ms-131', 50], ['us-ms-145', 51],
        ['us-ms-009', 52], ['us-ms-157', 53], ['us-ms-025', 54],
        ['us-ms-063', 55], ['us-ms-013', 56], ['us-ms-031', 57],
        ['us-ms-043', 58], ['us-ms-083', 59], ['us-ms-093', 60],
        ['us-ms-079', 61], ['us-ms-101', 62], ['us-ms-089', 63],
        ['us-ms-123', 64], ['us-ms-153', 65], ['us-ms-067', 66],
        ['us-ms-129', 67], ['us-ms-091', 68], ['us-ms-061', 69],
        ['us-ms-065', 70], ['us-ms-073', 71], ['us-ms-017', 72],
        ['us-ms-095', 73], ['us-ms-081', 74], ['us-ms-085', 75],
        ['us-ms-055', 76], ['us-ms-163', 77], ['us-ms-015', 78],
        ['us-ms-097', 79], ['us-ms-051', 80], ['us-ms-075', 81],
        ['us-ms-151', 82], ['us-ms-133', 83], ['us-ms-087', 84],
        ['us-ms-099', 85], ['us-ms-045', 86], ['us-ms-023', 87],
        ['us-ms-069', 88], ['us-ms-001', 89], ['us-ms-057', 90],
        ['us-ms-049', 91]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ms-all.topo.json">Mississippi</a>'
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
