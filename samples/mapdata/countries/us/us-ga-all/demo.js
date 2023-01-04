(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ga-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ga-295', 10], ['us-ga-261', 11], ['us-ga-179', 12],
        ['us-ga-001', 13], ['us-ga-279', 14], ['us-ga-061', 15],
        ['us-ga-037', 16], ['us-ga-077', 17], ['us-ga-199', 18],
        ['us-ga-023', 19], ['us-ga-175', 20], ['us-ga-251', 21],
        ['us-ga-033', 22], ['us-ga-285', 23], ['us-ga-145', 24],
        ['us-ga-213', 25], ['us-ga-087', 26], ['us-ga-131', 27],
        ['us-ga-081', 28], ['us-ga-287', 29], ['us-ga-171', 30],
        ['us-ga-231', 31], ['us-ga-097', 32], ['us-ga-067', 33],
        ['us-ga-193', 34], ['us-ga-249', 35], ['us-ga-269', 36],
        ['us-ga-157', 37], ['us-ga-229', 38], ['us-ga-305', 39],
        ['us-ga-045', 40], ['us-ga-223', 41], ['us-ga-015', 42],
        ['us-ga-005', 43], ['us-ga-299', 44], ['us-ga-115', 45],
        ['us-ga-233', 46], ['us-ga-225', 47], ['us-ga-079', 48],
        ['us-ga-121', 49], ['us-ga-063', 50], ['us-ga-009', 51],
        ['us-ga-169', 52], ['us-ga-149', 53], ['us-ga-201', 54],
        ['us-ga-253', 55], ['us-ga-139', 56], ['us-ga-187', 57],
        ['us-ga-117', 58], ['us-ga-085', 59], ['us-ga-057', 60],
        ['us-ga-021', 61], ['us-ga-153', 62], ['us-ga-235', 63],
        ['us-ga-237', 64], ['us-ga-311', 65], ['us-ga-245', 66],
        ['us-ga-163', 67], ['us-ga-181', 68], ['us-ga-189', 69],
        ['us-ga-105', 70], ['us-ga-317', 71], ['us-ga-137', 72],
        ['us-ga-247', 73], ['us-ga-135', 74], ['us-ga-283', 75],
        ['us-ga-065', 76], ['us-ga-185', 77], ['us-ga-165', 78],
        ['us-ga-321', 79], ['us-ga-127', 80], ['us-ga-191', 81],
        ['us-ga-207', 82], ['us-ga-221', 83], ['us-ga-219', 84],
        ['us-ga-027', 85], ['us-ga-289', 86], ['us-ga-205', 87],
        ['us-ga-119', 88], ['us-ga-095', 89], ['us-ga-161', 90],
        ['us-ga-271', 91], ['us-ga-315', 92], ['us-ga-093', 93],
        ['us-ga-281', 94], ['us-ga-215', 95], ['us-ga-263', 96],
        ['us-ga-265', 97], ['us-ga-141', 98], ['us-ga-017', 99],
        ['us-ga-013', 100], ['us-ga-297', 101], ['us-ga-147', 102],
        ['us-ga-195', 103], ['us-ga-003', 104], ['us-ga-173', 105],
        ['us-ga-101', 106], ['us-ga-019', 107], ['us-ga-277', 108],
        ['us-ga-293', 109], ['us-ga-197', 110], ['us-ga-259', 111],
        ['us-ga-273', 112], ['us-ga-177', 113], ['us-ga-217', 114],
        ['us-ga-211', 115], ['us-ga-059', 116], ['us-ga-053', 117],
        ['us-ga-011', 118], ['us-ga-103', 119], ['us-ga-029', 120],
        ['us-ga-155', 121], ['us-ga-109', 122], ['us-ga-031', 123],
        ['us-ga-091', 124], ['us-ga-309', 125], ['us-ga-143', 126],
        ['us-ga-069', 127], ['us-ga-267', 128], ['us-ga-129', 129],
        ['us-ga-123', 130], ['us-ga-111', 131], ['us-ga-319', 132],
        ['us-ga-167', 133], ['us-ga-125', 134], ['us-ga-209', 135],
        ['us-ga-089', 136], ['us-ga-151', 137], ['us-ga-243', 138],
        ['us-ga-307', 139], ['us-ga-255', 140], ['us-ga-035', 141],
        ['us-ga-039', 142], ['us-ga-083', 143], ['us-ga-051', 144],
        ['us-ga-073', 145], ['us-ga-241', 146], ['us-ga-183', 147],
        ['us-ga-007', 148], ['us-ga-275', 149], ['us-ga-099', 150],
        ['us-ga-055', 151], ['us-ga-291', 152], ['us-ga-257', 153],
        ['us-ga-047', 154], ['us-ga-107', 155], ['us-ga-071', 156],
        ['us-ga-239', 157], ['us-ga-025', 158], ['us-ga-049', 159],
        ['us-ga-227', 160], ['us-ga-303', 161], ['us-ga-133', 162],
        ['us-ga-159', 163], ['us-ga-301', 164], ['us-ga-113', 165],
        ['us-ga-075', 166], ['us-ga-043', 167], ['us-ga-313', 168]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ga-all.topo.json">Georgia</a>'
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
