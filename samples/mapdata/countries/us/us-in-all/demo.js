(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-in-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-in-139', 10], ['us-in-031', 11], ['us-in-149', 12],
        ['us-in-099', 13], ['us-in-033', 14], ['us-in-151', 15],
        ['us-in-043', 16], ['us-in-019', 17], ['us-in-181', 18],
        ['us-in-131', 19], ['us-in-153', 20], ['us-in-021', 21],
        ['us-in-045', 22], ['us-in-165', 23], ['us-in-039', 24],
        ['us-in-087', 25], ['us-in-093', 26], ['us-in-071', 27],
        ['us-in-171', 28], ['us-in-121', 29], ['us-in-167', 30],
        ['us-in-015', 31], ['us-in-065', 32], ['us-in-095', 33],
        ['us-in-053', 34], ['us-in-069', 35], ['us-in-003', 36],
        ['us-in-157', 37], ['us-in-023', 38], ['us-in-159', 39],
        ['us-in-067', 40], ['us-in-057', 41], ['us-in-059', 42],
        ['us-in-111', 43], ['us-in-073', 44], ['us-in-135', 45],
        ['us-in-035', 46], ['us-in-005', 47], ['us-in-081', 48],
        ['us-in-013', 49], ['us-in-055', 50], ['us-in-109', 51],
        ['us-in-133', 52], ['us-in-105', 53], ['us-in-137', 54],
        ['us-in-049', 55], ['us-in-169', 56], ['us-in-113', 57],
        ['us-in-075', 58], ['us-in-041', 59], ['us-in-027', 60],
        ['us-in-101', 61], ['us-in-103', 62], ['us-in-179', 63],
        ['us-in-009', 64], ['us-in-079', 65], ['us-in-143', 66],
        ['us-in-115', 67], ['us-in-029', 68], ['us-in-175', 69],
        ['us-in-107', 70], ['us-in-063', 71], ['us-in-145', 72],
        ['us-in-097', 73], ['us-in-011', 74], ['us-in-141', 75],
        ['us-in-037', 76], ['us-in-117', 77], ['us-in-025', 78],
        ['us-in-083', 79], ['us-in-173', 80], ['us-in-163', 81],
        ['us-in-051', 82], ['us-in-089', 83], ['us-in-007', 84],
        ['us-in-125', 85], ['us-in-155', 86], ['us-in-123', 87],
        ['us-in-161', 88], ['us-in-147', 89], ['us-in-001', 90],
        ['us-in-129', 91], ['us-in-061', 92], ['us-in-017', 93],
        ['us-in-085', 94], ['us-in-047', 95], ['us-in-119', 96],
        ['us-in-077', 97], ['us-in-091', 98], ['us-in-127', 99],
        ['us-in-177', 100], ['us-in-183', 101]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-in-all.topo.json">Indiana</a>'
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
