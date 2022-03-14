(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-va-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-va-510', 10], ['us-va-001', 11], ['us-va-013', 12],
        ['us-va-131', 13], ['us-va-600', 14], ['us-va-059', 15],
        ['us-va-690', 16], ['us-va-750', 17], ['us-va-595', 18],
        ['us-va-678', 19], ['us-va-530', 20], ['us-va-051', 21],
        ['us-va-167', 22], ['us-va-153', 23], ['us-va-840', 24],
        ['us-va-085', 25], ['us-va-075', 26], ['us-va-031', 27],
        ['us-va-037', 28], ['us-va-720', 29], ['us-va-800', 30],
        ['us-va-061', 31], ['us-va-520', 32], ['us-va-515', 33],
        ['us-va-035', 34], ['us-va-580', 35], ['us-va-005', 36],
        ['us-va-045', 37], ['us-va-083', 38], ['us-va-015', 39],
        ['us-va-003', 40], ['us-va-540', 41], ['us-va-033', 42],
        ['us-va-101', 43], ['us-va-740', 44], ['us-va-195', 45],
        ['us-va-105', 46], ['us-va-077', 47], ['us-va-193', 48],
        ['us-va-057', 49], ['us-va-113', 50], ['us-va-157', 51],
        ['us-va-735', 52], ['us-va-199', 53], ['us-va-640', 54],
        ['us-va-685', 55], ['us-va-683', 56], ['us-va-053', 57],
        ['us-va-081', 58], ['us-va-087', 59], ['us-va-071', 60],
        ['us-va-121', 61], ['us-va-179', 62], ['us-va-630', 63],
        ['us-va-047', 64], ['us-va-550', 65], ['us-va-710', 66],
        ['us-va-155', 67], ['us-va-063', 68], ['us-va-021', 69],
        ['us-va-115', 70], ['us-va-073', 71], ['us-va-097', 72],
        ['us-va-119', 73], ['us-va-041', 74], ['us-va-570', 75],
        ['us-va-149', 76], ['us-va-670', 77], ['us-va-730', 78],
        ['us-va-775', 79], ['us-va-770', 80], ['us-va-065', 81],
        ['us-va-049', 82], ['us-va-007', 83], ['us-va-147', 84],
        ['us-va-650', 85], ['us-va-187', 86], ['us-va-069', 87],
        ['us-va-163', 88], ['us-va-125', 89], ['us-va-036', 90],
        ['us-va-111', 91], ['us-va-173', 92], ['us-va-093', 93],
        ['us-va-175', 94], ['us-va-620', 95], ['us-va-099', 96],
        ['us-va-191', 97], ['us-va-095', 98], ['us-va-830', 99],
        ['us-va-177', 100], ['us-va-810', 101], ['us-va-137', 102],
        ['us-va-127', 103], ['us-va-159', 104], ['us-va-019', 105],
        ['us-va-009', 106], ['us-va-011', 107], ['us-va-680', 108],
        ['us-va-610', 109], ['us-va-161', 110], ['us-va-590', 111],
        ['us-va-023', 112], ['us-va-143', 113], ['us-va-165', 114],
        ['us-va-029', 115], ['us-va-043', 116], ['us-va-700', 117],
        ['us-va-017', 118], ['us-va-185', 119], ['us-va-107', 120],
        ['us-va-091', 121], ['us-va-089', 122], ['us-va-169', 123],
        ['us-va-025', 124], ['us-va-027', 125], ['us-va-135', 126],
        ['us-va-067', 127], ['us-va-109', 128], ['us-va-181', 129],
        ['us-va-183', 130], ['us-va-103', 131], ['us-va-117', 132],
        ['us-va-171', 133], ['us-va-133', 134], ['us-va-141', 135],
        ['us-va-079', 136], ['us-va-197', 137], ['us-va-660', 138],
        ['us-va-820', 139], ['us-va-790', 140], ['us-va-145', 141],
        ['us-va-760', 142], ['us-va-139', 143]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-va-all.topo.json">Virginia</a>'
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
