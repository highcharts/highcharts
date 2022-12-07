(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-tx-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-tx-179', 10], ['us-tx-393', 11], ['us-tx-311', 12],
        ['us-tx-131', 13], ['us-tx-297', 14], ['us-tx-289', 15],
        ['us-tx-225', 16], ['us-tx-279', 17], ['us-tx-017', 18],
        ['us-tx-419', 19], ['us-tx-405', 20], ['us-tx-463', 21],
        ['us-tx-325', 22], ['us-tx-067', 23], ['us-tx-075', 24],
        ['us-tx-501', 25], ['us-tx-445', 26], ['us-tx-507', 27],
        ['us-tx-051', 28], ['us-tx-331', 29], ['us-tx-159', 30],
        ['us-tx-223', 31], ['us-tx-203', 32], ['us-tx-423', 33],
        ['us-tx-401', 34], ['us-tx-355', 35], ['us-tx-165', 36],
        ['us-tx-125', 37], ['us-tx-345', 38], ['us-tx-155', 39],
        ['us-tx-101', 40], ['us-tx-461', 41], ['us-tx-329', 42],
        ['us-tx-369', 43], ['us-tx-117', 44], ['us-tx-359', 45],
        ['us-tx-109', 46], ['us-tx-243', 47], ['us-tx-079', 48],
        ['us-tx-377', 49], ['us-tx-365', 50], ['us-tx-471', 51],
        ['us-tx-339', 52], ['us-tx-201', 53], ['us-tx-157', 54],
        ['us-tx-247', 55], ['us-tx-505', 56], ['us-tx-239', 57],
        ['us-tx-481', 58], ['us-tx-451', 59], ['us-tx-095', 60],
        ['us-tx-361', 61], ['us-tx-309', 62], ['us-tx-217', 63],
        ['us-tx-153', 64], ['us-tx-189', 65], ['us-tx-219', 66],
        ['us-tx-303', 67], ['us-tx-483', 68], ['us-tx-107', 69],
        ['us-tx-211', 70], ['us-tx-001', 71], ['us-tx-151', 72],
        ['us-tx-253', 73], ['us-tx-087', 74], ['us-tx-199', 75],
        ['us-tx-457', 76], ['us-tx-347', 77], ['us-tx-495', 78],
        ['us-tx-283', 79], ['us-tx-383', 80], ['us-tx-173', 81],
        ['us-tx-123', 82], ['us-tx-255', 83], ['us-tx-285', 84],
        ['us-tx-099', 85], ['us-tx-035', 86], ['us-tx-397', 87],
        ['us-tx-113', 88], ['us-tx-275', 89], ['us-tx-257', 90],
        ['us-tx-413', 91], ['us-tx-327', 92], ['us-tx-403', 93],
        ['us-tx-195', 94], ['us-tx-233', 95], ['us-tx-065', 96],
        ['us-tx-047', 97], ['us-tx-235', 98], ['us-tx-287', 99],
        ['us-tx-007', 100], ['us-tx-073', 101], ['us-tx-425', 102],
        ['us-tx-143', 103], ['us-tx-251', 104], ['us-tx-185', 105],
        ['us-tx-407', 106], ['us-tx-221', 107], ['us-tx-385', 108],
        ['us-tx-167', 109], ['us-tx-071', 110], ['us-tx-293', 111],
        ['us-tx-395', 112], ['us-tx-313', 113], ['us-tx-041', 114],
        ['us-tx-005', 115], ['us-tx-231', 116], ['us-tx-147', 117],
        ['us-tx-181', 118], ['us-tx-411', 119], ['us-tx-053', 120],
        ['us-tx-119', 121], ['us-tx-023', 122], ['us-tx-031', 123],
        ['us-tx-299', 124], ['us-tx-019', 125], ['us-tx-029', 126],
        ['us-tx-013', 127], ['us-tx-163', 128], ['us-tx-315', 129],
        ['us-tx-343', 130], ['us-tx-215', 131], ['us-tx-027', 132],
        ['us-tx-269', 133], ['us-tx-399', 134], ['us-tx-465', 135],
        ['us-tx-435', 136], ['us-tx-271', 137], ['us-tx-137', 138],
        ['us-tx-091', 139], ['us-tx-187', 140], ['us-tx-477', 141],
        ['us-tx-379', 142], ['us-tx-139', 143], ['us-tx-213', 144],
        ['us-tx-111', 145], ['us-tx-421', 146], ['us-tx-493', 147],
        ['us-tx-467', 148], ['us-tx-057', 149], ['us-tx-391', 150],
        ['us-tx-321', 151], ['us-tx-341', 152], ['us-tx-499', 153],
        ['us-tx-063', 154], ['us-tx-121', 155], ['us-tx-439', 156],
        ['us-tx-273', 157], ['us-tx-261', 158], ['us-tx-381', 159],
        ['us-tx-437', 160], ['us-tx-389', 161], ['us-tx-323', 162],
        ['us-tx-479', 163], ['us-tx-409', 164], ['us-tx-249', 165],
        ['us-tx-317', 166], ['us-tx-115', 167], ['us-tx-455', 168],
        ['us-tx-191', 169], ['us-tx-037', 170], ['us-tx-459', 171],
        ['us-tx-443', 172], ['us-tx-105', 173], ['us-tx-371', 174],
        ['us-tx-349', 175], ['us-tx-161', 176], ['us-tx-353', 177],
        ['us-tx-441', 178], ['us-tx-083', 179], ['us-tx-003', 180],
        ['us-tx-491', 181], ['us-tx-375', 182], ['us-tx-009', 183],
        ['us-tx-077', 184], ['us-tx-237', 185], ['us-tx-503', 186],
        ['us-tx-367', 187], ['us-tx-469', 188], ['us-tx-169', 189],
        ['us-tx-305', 190], ['us-tx-363', 191], ['us-tx-133', 192],
        ['us-tx-059', 193], ['us-tx-417', 194], ['us-tx-207', 195],
        ['us-tx-427', 196], ['us-tx-043', 197], ['us-tx-127', 198],
        ['us-tx-055', 199], ['us-tx-209', 200], ['us-tx-337', 201],
        ['us-tx-049', 202], ['us-tx-259', 203], ['us-tx-265', 204],
        ['us-tx-171', 205], ['us-tx-061', 206], ['us-tx-473', 207],
        ['us-tx-319', 208], ['us-tx-085', 209], ['us-tx-205', 210],
        ['us-tx-177', 211], ['us-tx-183', 212], ['us-tx-145', 213],
        ['us-tx-015', 214], ['us-tx-149', 215], ['us-tx-011', 216],
        ['us-tx-045', 217], ['us-tx-039', 218], ['us-tx-267', 219],
        ['us-tx-487', 220], ['us-tx-485', 221], ['us-tx-025', 222],
        ['us-tx-175', 223], ['us-tx-489', 224], ['us-tx-241', 225],
        ['us-tx-351', 226], ['us-tx-307', 227], ['us-tx-281', 228],
        ['us-tx-193', 229], ['us-tx-453', 230], ['us-tx-263', 231],
        ['us-tx-021', 232], ['us-tx-229', 233], ['us-tx-475', 234],
        ['us-tx-301', 235], ['us-tx-081', 236], ['us-tx-069', 237],
        ['us-tx-295', 238], ['us-tx-357', 239], ['us-tx-415', 240],
        ['us-tx-373', 241], ['us-tx-291', 242], ['us-tx-433', 243],
        ['us-tx-089', 244], ['us-tx-135', 245], ['us-tx-497', 246],
        ['us-tx-097', 247], ['us-tx-245', 248], ['us-tx-227', 249],
        ['us-tx-387', 250], ['us-tx-431', 251], ['us-tx-335', 252],
        ['us-tx-033', 253], ['us-tx-197', 254], ['us-tx-277', 255],
        ['us-tx-447', 256], ['us-tx-129', 257], ['us-tx-141', 258],
        ['us-tx-093', 259], ['us-tx-103', 260], ['us-tx-333', 261],
        ['us-tx-449', 262], ['us-tx-429', 263]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-tx-all.topo.json">Texas</a>'
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
