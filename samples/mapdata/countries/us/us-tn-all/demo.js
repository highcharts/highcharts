(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-tn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-tn-023', 10], ['us-tn-069', 11], ['us-tn-113', 12],
        ['us-tn-077', 13], ['us-tn-157', 14], ['us-tn-033', 15],
        ['us-tn-053', 16], ['us-tn-021', 17], ['us-tn-147', 18],
        ['us-tn-105', 19], ['us-tn-037', 20], ['us-tn-107', 21],
        ['us-tn-011', 22], ['us-tn-043', 23], ['us-tn-125', 24],
        ['us-tn-047', 25], ['us-tn-167', 26], ['us-tn-177', 27],
        ['us-tn-031', 28], ['us-tn-163', 29], ['us-tn-091', 30],
        ['us-tn-187', 31], ['us-tn-019', 32], ['us-tn-179', 33],
        ['us-tn-073', 34], ['us-tn-149', 35], ['us-tn-189', 36],
        ['us-tn-015', 37], ['us-tn-175', 38], ['us-tn-007', 39],
        ['us-tn-035', 40], ['us-tn-057', 41], ['us-tn-173', 42],
        ['us-tn-051', 43], ['us-tn-145', 44], ['us-tn-087', 45],
        ['us-tn-133', 46], ['us-tn-001', 47], ['us-tn-151', 48],
        ['us-tn-097', 49], ['us-tn-119', 50], ['us-tn-027', 51],
        ['us-tn-111', 52], ['us-tn-041', 53], ['us-tn-039', 54],
        ['us-tn-017', 55], ['us-tn-161', 56], ['us-tn-005', 57],
        ['us-tn-159', 58], ['us-tn-141', 59], ['us-tn-049', 60],
        ['us-tn-103', 61], ['us-tn-003', 62], ['us-tn-137', 63],
        ['us-tn-123', 64], ['us-tn-093', 65], ['us-tn-135', 66],
        ['us-tn-059', 67], ['us-tn-171', 68], ['us-tn-071', 69],
        ['us-tn-117', 70], ['us-tn-055', 71], ['us-tn-099', 72],
        ['us-tn-185', 73], ['us-tn-153', 74], ['us-tn-127', 75],
        ['us-tn-143', 76], ['us-tn-065', 77], ['us-tn-079', 78],
        ['us-tn-155', 79], ['us-tn-109', 80], ['us-tn-013', 81],
        ['us-tn-009', 82], ['us-tn-121', 83], ['us-tn-165', 84],
        ['us-tn-115', 85], ['us-tn-045', 86], ['us-tn-169', 87],
        ['us-tn-095', 88], ['us-tn-131', 89], ['us-tn-183', 90],
        ['us-tn-089', 91], ['us-tn-029', 92], ['us-tn-067', 93],
        ['us-tn-139', 94], ['us-tn-081', 95], ['us-tn-085', 96],
        ['us-tn-181', 97], ['us-tn-025', 98], ['us-tn-061', 99],
        ['us-tn-075', 100], ['us-tn-101', 101], ['us-tn-129', 102],
        ['us-tn-083', 103], ['us-tn-063', 104]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-tn-all.topo.json">Tennessee</a>'
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
