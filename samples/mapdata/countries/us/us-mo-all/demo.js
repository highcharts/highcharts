(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-mo-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-mo-223', 10], ['us-mo-179', 11], ['us-mo-035', 12],
        ['us-mo-145', 13], ['us-mo-003', 14], ['us-mo-147', 15],
        ['us-mo-199', 16], ['us-mo-103', 17], ['us-mo-097', 18],
        ['us-mo-011', 19], ['us-mo-227', 20], ['us-mo-079', 21],
        ['us-mo-117', 22], ['us-mo-125', 23], ['us-mo-131', 24],
        ['us-mo-073', 25], ['us-mo-151', 26], ['us-mo-021', 27],
        ['us-mo-165', 28], ['us-mo-209', 29], ['us-mo-111', 30],
        ['us-mo-127', 31], ['us-mo-107', 32], ['us-mo-101', 33],
        ['us-mo-163', 34], ['us-mo-007', 35], ['us-mo-211', 36],
        ['us-mo-129', 37], ['us-mo-119', 38], ['us-mo-009', 39],
        ['us-mo-173', 40], ['us-mo-201', 41], ['us-mo-143', 42],
        ['us-mo-187', 43], ['us-mo-099', 44], ['us-mo-186', 45],
        ['us-mo-093', 46], ['us-mo-221', 47], ['us-mo-157', 48],
        ['us-mo-109', 49], ['us-mo-123', 50], ['us-mo-075', 51],
        ['us-mo-139', 52], ['us-mo-045', 53], ['us-mo-121', 54],
        ['us-mo-001', 55], ['us-mo-039', 56], ['us-mo-167', 57],
        ['us-mo-085', 58], ['us-mo-029', 59], ['us-mo-189', 60],
        ['us-mo-067', 61], ['us-mo-091', 62], ['us-mo-041', 63],
        ['us-mo-141', 64], ['us-mo-015', 65], ['us-mo-149', 66],
        ['us-mo-115', 67], ['us-mo-175', 68], ['us-mo-137', 69],
        ['us-mo-219', 70], ['us-mo-047', 71], ['us-mo-081', 72],
        ['us-mo-059', 73], ['us-mo-077', 74], ['us-mo-061', 75],
        ['us-mo-195', 76], ['us-mo-053', 77], ['us-mo-019', 78],
        ['us-mo-065', 79], ['us-mo-013', 80], ['us-mo-083', 81],
        ['us-mo-095', 82], ['us-mo-215', 83], ['us-mo-159', 84],
        ['us-mo-057', 85], ['us-mo-043', 86], ['us-mo-135', 87],
        ['us-mo-205', 88], ['us-mo-185', 89], ['us-mo-055', 90],
        ['us-mo-033', 91], ['us-mo-025', 92], ['us-mo-049', 93],
        ['us-mo-063', 94], ['us-mo-213', 95], ['us-mo-225', 96],
        ['us-mo-171', 97], ['us-mo-023', 98], ['us-mo-031', 99],
        ['us-mo-133', 100], ['us-mo-113', 101], ['us-mo-197', 102],
        ['us-mo-037', 103], ['us-mo-069', 104], ['us-mo-153', 105],
        ['us-mo-017', 106], ['us-mo-183', 107], ['us-mo-071', 108],
        ['us-mo-181', 109], ['us-mo-177', 110], ['us-mo-087', 111],
        ['us-mo-217', 112], ['us-mo-105', 113], ['us-mo-169', 114],
        ['us-mo-161', 115], ['us-mo-229', 116], ['us-mo-155', 117],
        ['us-mo-203', 118], ['us-mo-005', 119], ['us-mo-510', 120],
        ['us-mo-207', 121], ['us-mo-027', 122], ['us-mo-051', 123],
        ['us-mo-089', 124]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mo-all.topo.json">Missouri</a>'
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
