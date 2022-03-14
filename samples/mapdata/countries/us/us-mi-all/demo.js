(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-mi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-mi-089', 10], ['us-mi-019', 11], ['us-mi-003', 12],
        ['us-mi-163', 13], ['us-mi-033', 14], ['us-mi-161', 15],
        ['us-mi-059', 16], ['us-mi-091', 17], ['us-mi-115', 18],
        ['us-mi-129', 19], ['us-mi-069', 20], ['us-mi-025', 21],
        ['us-mi-023', 22], ['us-mi-127', 23], ['us-mi-123', 24],
        ['us-mi-097', 25], ['us-mi-077', 26], ['us-mi-149', 27],
        ['us-mi-055', 28], ['us-mi-029', 29], ['us-mi-145', 30],
        ['us-mi-049', 31], ['us-mi-015', 32], ['us-mi-005', 33],
        ['us-mi-071', 34], ['us-mi-043', 35], ['us-mi-103', 36],
        ['us-mi-165', 37], ['us-mi-101', 38], ['us-mi-159', 39],
        ['us-mi-027', 40], ['us-mi-139', 41], ['us-mi-009', 42],
        ['us-mi-137', 43], ['us-mi-007', 44], ['us-mi-119', 45],
        ['us-mi-155', 46], ['us-mi-001', 47], ['us-mi-135', 48],
        ['us-mi-079', 49], ['us-mi-039', 50], ['us-mi-107', 51],
        ['us-mi-095', 52], ['us-mi-153', 53], ['us-mi-075', 54],
        ['us-mi-093', 55], ['us-mi-045', 56], ['us-mi-035', 57],
        ['us-mi-073', 58], ['us-mi-087', 59], ['us-mi-099', 60],
        ['us-mi-011', 61], ['us-mi-085', 62], ['us-mi-133', 63],
        ['us-mi-131', 64], ['us-mi-067', 65], ['us-mi-157', 66],
        ['us-mi-017', 67], ['us-mi-109', 68], ['us-mi-081', 69],
        ['us-mi-057', 70], ['us-mi-143', 71], ['us-mi-121', 72],
        ['us-mi-113', 73], ['us-mi-037', 74], ['us-mi-065', 75],
        ['us-mi-031', 76], ['us-mi-051', 77], ['us-mi-111', 78],
        ['us-mi-141', 79], ['us-mi-041', 80], ['us-mi-053', 81],
        ['us-mi-047', 82], ['us-mi-151', 83], ['us-mi-013', 84],
        ['us-mi-063', 85], ['us-mi-105', 86], ['us-mi-083', 87],
        ['us-mi-021', 88], ['us-mi-061', 89], ['us-mi-125', 90],
        ['us-mi-117', 91], ['us-mi-147', 92]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mi-all.topo.json">Michigan</a>'
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
