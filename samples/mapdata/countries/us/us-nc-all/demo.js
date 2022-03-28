(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-nc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-nc-031', 10], ['us-nc-187', 11], ['us-nc-095', 12],
        ['us-nc-129', 13], ['us-nc-183', 14], ['us-nc-077', 15],
        ['us-nc-121', 16], ['us-nc-011', 17], ['us-nc-091', 18],
        ['us-nc-033', 19], ['us-nc-001', 20], ['us-nc-019', 21],
        ['us-nc-087', 22], ['us-nc-175', 23], ['us-nc-153', 24],
        ['us-nc-107', 25], ['us-nc-191', 26], ['us-nc-079', 27],
        ['us-nc-161', 28], ['us-nc-101', 29], ['us-nc-127', 30],
        ['us-nc-081', 31], ['us-nc-157', 32], ['us-nc-013', 33],
        ['us-nc-137', 34], ['us-nc-103', 35], ['us-nc-049', 36],
        ['us-nc-063', 37], ['us-nc-037', 38], ['us-nc-185', 39],
        ['us-nc-131', 40], ['us-nc-065', 41], ['us-nc-195', 42],
        ['us-nc-145', 43], ['us-nc-083', 44], ['us-nc-117', 45],
        ['us-nc-135', 46], ['us-nc-055', 47], ['us-nc-099', 48],
        ['us-nc-159', 49], ['us-nc-097', 50], ['us-nc-025', 51],
        ['us-nc-179', 52], ['us-nc-181', 53], ['us-nc-177', 54],
        ['us-nc-189', 55], ['us-nc-193', 56], ['us-nc-003', 57],
        ['us-nc-027', 58], ['us-nc-151', 59], ['us-nc-041', 60],
        ['us-nc-073', 61], ['us-nc-139', 62], ['us-nc-039', 63],
        ['us-nc-113', 64], ['us-nc-133', 65], ['us-nc-045', 66],
        ['us-nc-109', 67], ['us-nc-119', 68], ['us-nc-199', 69],
        ['us-nc-089', 70], ['us-nc-147', 71], ['us-nc-143', 72],
        ['us-nc-125', 73], ['us-nc-007', 74], ['us-nc-141', 75],
        ['us-nc-163', 76], ['us-nc-085', 77], ['us-nc-155', 78],
        ['us-nc-051', 79], ['us-nc-075', 80], ['us-nc-023', 81],
        ['us-nc-165', 82], ['us-nc-093', 83], ['us-nc-111', 84],
        ['us-nc-047', 85], ['us-nc-061', 86], ['us-nc-197', 87],
        ['us-nc-067', 88], ['us-nc-171', 89], ['us-nc-169', 90],
        ['us-nc-057', 91], ['us-nc-059', 92], ['us-nc-029', 93],
        ['us-nc-053', 94], ['us-nc-009', 95], ['us-nc-115', 96],
        ['us-nc-021', 97], ['us-nc-071', 98], ['us-nc-015', 99],
        ['us-nc-173', 100], ['us-nc-035', 101], ['us-nc-069', 102],
        ['us-nc-005', 103], ['us-nc-123', 104], ['us-nc-149', 105],
        ['us-nc-105', 106], ['us-nc-043', 107], ['us-nc-017', 108],
        ['us-nc-167', 109]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-nc-all.topo.json">North Carolina</a>'
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
