(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ia-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ia-125', 10], ['us-ia-123', 11], ['us-ia-041', 12],
        ['us-ia-141', 13], ['us-ia-151', 14], ['us-ia-187', 15],
        ['us-ia-025', 16], ['us-ia-001', 17], ['us-ia-175', 18],
        ['us-ia-115', 19], ['us-ia-087', 20], ['us-ia-183', 21],
        ['us-ia-101', 22], ['us-ia-119', 23], ['us-ia-143', 24],
        ['us-ia-153', 25], ['us-ia-015', 26], ['us-ia-157', 27],
        ['us-ia-107', 28], ['us-ia-179', 29], ['us-ia-147', 30],
        ['us-ia-063', 31], ['us-ia-079', 32], ['us-ia-033', 33],
        ['us-ia-069', 34], ['us-ia-169', 35], ['us-ia-047', 36],
        ['us-ia-085', 37], ['us-ia-121', 38], ['us-ia-171', 39],
        ['us-ia-013', 40], ['us-ia-039', 41], ['us-ia-011', 42],
        ['us-ia-019', 43], ['us-ia-181', 44], ['us-ia-117', 45],
        ['us-ia-099', 46], ['us-ia-003', 47], ['us-ia-105', 48],
        ['us-ia-061', 49], ['us-ia-055', 50], ['us-ia-155', 51],
        ['us-ia-137', 52], ['us-ia-029', 53], ['us-ia-145', 54],
        ['us-ia-129', 55], ['us-ia-081', 56], ['us-ia-197', 57],
        ['us-ia-161', 58], ['us-ia-027', 59], ['us-ia-113', 60],
        ['us-ia-017', 61], ['us-ia-037', 62], ['us-ia-067', 63],
        ['us-ia-065', 64], ['us-ia-043', 65], ['us-ia-189', 66],
        ['us-ia-195', 67], ['us-ia-021', 68], ['us-ia-035', 69],
        ['us-ia-193', 70], ['us-ia-135', 71], ['us-ia-103', 72],
        ['us-ia-177', 73], ['us-ia-111', 74], ['us-ia-083', 75],
        ['us-ia-127', 76], ['us-ia-009', 77], ['us-ia-165', 78],
        ['us-ia-031', 79], ['us-ia-045', 80], ['us-ia-023', 81],
        ['us-ia-131', 82], ['us-ia-095', 83], ['us-ia-073', 84],
        ['us-ia-049', 85], ['us-ia-077', 86], ['us-ia-191', 87],
        ['us-ia-133', 88], ['us-ia-093', 89], ['us-ia-007', 90],
        ['us-ia-075', 91], ['us-ia-059', 92], ['us-ia-139', 93],
        ['us-ia-173', 94], ['us-ia-149', 95], ['us-ia-109', 96],
        ['us-ia-053', 97], ['us-ia-159', 98], ['us-ia-051', 99],
        ['us-ia-185', 100], ['us-ia-057', 101], ['us-ia-163', 102],
        ['us-ia-097', 103], ['us-ia-091', 104], ['us-ia-071', 105],
        ['us-ia-167', 106], ['us-ia-089', 107], ['us-ia-005', 108]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ia-all.topo.json">Iowa</a>'
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
