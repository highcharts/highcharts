(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ks-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ks-091', 10], ['us-ks-045', 11], ['us-ks-165', 12],
        ['us-ks-051', 13], ['us-ks-195', 14], ['us-ks-205', 15],
        ['us-ks-125', 16], ['us-ks-137', 17], ['us-ks-065', 18],
        ['us-ks-179', 19], ['us-ks-079', 20], ['us-ks-155', 21],
        ['us-ks-053', 22], ['us-ks-105', 23], ['us-ks-035', 24],
        ['us-ks-019', 25], ['us-ks-063', 26], ['us-ks-109', 27],
        ['us-ks-135', 28], ['us-ks-181', 29], ['us-ks-153', 30],
        ['us-ks-023', 31], ['us-ks-145', 32], ['us-ks-009', 33],
        ['us-ks-089', 34], ['us-ks-123', 35], ['us-ks-029', 36],
        ['us-ks-143', 37], ['us-ks-071', 38], ['us-ks-075', 39],
        ['us-ks-041', 40], ['us-ks-131', 41], ['us-ks-149', 42],
        ['us-ks-013', 43], ['us-ks-005', 44], ['us-ks-127', 45],
        ['us-ks-111', 46], ['us-ks-073', 47], ['us-ks-161', 48],
        ['us-ks-197', 49], ['us-ks-061', 50], ['us-ks-115', 51],
        ['us-ks-095', 52], ['us-ks-141', 53], ['us-ks-085', 54],
        ['us-ks-037', 55], ['us-ks-099', 56], ['us-ks-049', 57],
        ['us-ks-133', 58], ['us-ks-057', 59], ['us-ks-047', 60],
        ['us-ks-151', 61], ['us-ks-169', 62], ['us-ks-113', 63],
        ['us-ks-203', 64], ['us-ks-167', 65], ['us-ks-163', 66],
        ['us-ks-011', 67], ['us-ks-055', 68], ['us-ks-083', 69],
        ['us-ks-039', 70], ['us-ks-193', 71], ['us-ks-147', 72],
        ['us-ks-069', 73], ['us-ks-175', 74], ['us-ks-119', 75],
        ['us-ks-081', 76], ['us-ks-007', 77], ['us-ks-103', 78],
        ['us-ks-093', 79], ['us-ks-171', 80], ['us-ks-177', 81],
        ['us-ks-187', 82], ['us-ks-189', 83], ['us-ks-031', 84],
        ['us-ks-059', 85], ['us-ks-207', 86], ['us-ks-139', 87],
        ['us-ks-183', 88], ['us-ks-199', 89], ['us-ks-173', 90],
        ['us-ks-077', 91], ['us-ks-191', 92], ['us-ks-001', 93],
        ['us-ks-121', 94], ['us-ks-021', 95], ['us-ks-033', 96],
        ['us-ks-185', 97], ['us-ks-159', 98], ['us-ks-117', 99],
        ['us-ks-015', 100], ['us-ks-017', 101], ['us-ks-043', 102],
        ['us-ks-107', 103], ['us-ks-157', 104], ['us-ks-097', 105],
        ['us-ks-067', 106], ['us-ks-129', 107], ['us-ks-025', 108],
        ['us-ks-003', 109], ['us-ks-209', 110], ['us-ks-027', 111],
        ['us-ks-087', 112], ['us-ks-201', 113], ['us-ks-101', 114]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ks-all.topo.json">Kansas</a>'
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
