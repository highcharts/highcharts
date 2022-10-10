(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-il-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-il-003', 10], ['us-il-181', 11], ['us-il-187', 12],
        ['us-il-109', 13], ['us-il-147', 14], ['us-il-113', 15],
        ['us-il-195', 16], ['us-il-089', 17], ['us-il-043', 18],
        ['us-il-119', 19], ['us-il-083', 20], ['us-il-193', 21],
        ['us-il-059', 22], ['us-il-019', 23], ['us-il-053', 24],
        ['us-il-041', 25], ['us-il-045', 26], ['us-il-007', 27],
        ['us-il-201', 28], ['us-il-155', 29], ['us-il-099', 30],
        ['us-il-121', 31], ['us-il-025', 32], ['us-il-197', 33],
        ['us-il-049', 34], ['us-il-051', 35], ['us-il-035', 36],
        ['us-il-163', 37], ['us-il-027', 38], ['us-il-189', 39],
        ['us-il-145', 40], ['us-il-175', 41], ['us-il-073', 42],
        ['us-il-123', 43], ['us-il-143', 44], ['us-il-011', 45],
        ['us-il-103', 46], ['us-il-029', 47], ['us-il-037', 48],
        ['us-il-093', 49], ['us-il-039', 50], ['us-il-107', 51],
        ['us-il-129', 52], ['us-il-157', 53], ['us-il-077', 54],
        ['us-il-203', 55], ['us-il-105', 56], ['us-il-057', 57],
        ['us-il-071', 58], ['us-il-135', 59], ['us-il-061', 60],
        ['us-il-149', 61], ['us-il-017', 62], ['us-il-009', 63],
        ['us-il-137', 64], ['us-il-117', 65], ['us-il-005', 66],
        ['us-il-191', 67], ['us-il-167', 68], ['us-il-153', 69],
        ['us-il-127', 70], ['us-il-065', 71], ['us-il-047', 72],
        ['us-il-173', 73], ['us-il-115', 74], ['us-il-021', 75],
        ['us-il-031', 76], ['us-il-131', 77], ['us-il-183', 78],
        ['us-il-185', 79], ['us-il-101', 80], ['us-il-111', 81],
        ['us-il-179', 82], ['us-il-055', 83], ['us-il-081', 84],
        ['us-il-141', 85], ['us-il-067', 86], ['us-il-169', 87],
        ['us-il-079', 88], ['us-il-023', 89], ['us-il-091', 90],
        ['us-il-125', 91], ['us-il-159', 92], ['us-il-165', 93],
        ['us-il-069', 94], ['us-il-151', 95], ['us-il-133', 96],
        ['us-il-177', 97], ['us-il-161', 98], ['us-il-001', 99],
        ['us-il-075', 100], ['us-il-087', 101], ['us-il-095', 102],
        ['us-il-013', 103], ['us-il-171', 104], ['us-il-015', 105],
        ['us-il-063', 106], ['us-il-085', 107], ['us-il-199', 108],
        ['us-il-033', 109], ['us-il-097', 110], ['us-il-139', 111]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-il-all.topo.json">Illinois</a>'
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
