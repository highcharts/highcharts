(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ky-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ky-091', 10], ['us-ky-183', 11], ['us-ky-149', 12],
        ['us-ky-019', 13], ['us-ky-089', 14], ['us-ky-083', 15],
        ['us-ky-157', 16], ['us-ky-185', 17], ['us-ky-111', 18],
        ['us-ky-029', 19], ['us-ky-017', 20], ['us-ky-049', 21],
        ['us-ky-173', 22], ['us-ky-031', 23], ['us-ky-085', 24],
        ['us-ky-045', 25], ['us-ky-207', 26], ['us-ky-155', 27],
        ['us-ky-179', 28], ['us-ky-199', 29], ['us-ky-177', 30],
        ['us-ky-129', 31], ['us-ky-237', 32], ['us-ky-197', 33],
        ['us-ky-187', 34], ['us-ky-041', 35], ['us-ky-239', 36],
        ['us-ky-209', 37], ['us-ky-107', 38], ['us-ky-141', 39],
        ['us-ky-077', 40], ['us-ky-015', 41], ['us-ky-079', 42],
        ['us-ky-021', 43], ['us-ky-229', 44], ['us-ky-221', 45],
        ['us-ky-193', 46], ['us-ky-051', 47], ['us-ky-109', 48],
        ['us-ky-165', 49], ['us-ky-205', 50], ['us-ky-061', 51],
        ['us-ky-033', 52], ['us-ky-233', 53], ['us-ky-001', 54],
        ['us-ky-087', 55], ['us-ky-223', 56], ['us-ky-167', 57],
        ['us-ky-113', 58], ['us-ky-093', 59], ['us-ky-099', 60],
        ['us-ky-211', 61], ['us-ky-171', 62], ['us-ky-003', 63],
        ['us-ky-023', 64], ['us-ky-201', 65], ['us-ky-069', 66],
        ['us-ky-195', 67], ['us-ky-119', 68], ['us-ky-025', 69],
        ['us-ky-071', 70], ['us-ky-159', 71], ['us-ky-125', 72],
        ['us-ky-147', 73], ['us-ky-191', 74], ['us-ky-215', 75],
        ['us-ky-057', 76], ['us-ky-053', 77], ['us-ky-231', 78],
        ['us-ky-009', 79], ['us-ky-227', 80], ['us-ky-105', 81],
        ['us-ky-035', 82], ['us-ky-065', 83], ['us-ky-189', 84],
        ['us-ky-027', 85], ['us-ky-127', 86], ['us-ky-175', 87],
        ['us-ky-115', 88], ['us-ky-213', 89], ['us-ky-081', 90],
        ['us-ky-117', 91], ['us-ky-169', 92], ['us-ky-235', 93],
        ['us-ky-097', 94], ['us-ky-005', 95], ['us-ky-039', 96],
        ['us-ky-145', 97], ['us-ky-139', 98], ['us-ky-055', 99],
        ['us-ky-143', 100], ['us-ky-151', 101], ['us-ky-203', 102],
        ['us-ky-153', 103], ['us-ky-131', 104], ['us-ky-013', 105],
        ['us-ky-181', 106], ['us-ky-037', 107], ['us-ky-135', 108],
        ['us-ky-075', 109], ['us-ky-101', 110], ['us-ky-059', 111],
        ['us-ky-095', 112], ['us-ky-161', 113], ['us-ky-123', 114],
        ['us-ky-137', 115], ['us-ky-043', 116], ['us-ky-047', 117],
        ['us-ky-063', 118], ['us-ky-133', 119], ['us-ky-121', 120],
        ['us-ky-219', 121], ['us-ky-225', 122], ['us-ky-067', 123],
        ['us-ky-163', 124], ['us-ky-007', 125], ['us-ky-011', 126],
        ['us-ky-217', 127], ['us-ky-103', 128], ['us-ky-073', 129]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ky-all.topo.json">Kentucky</a>'
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
