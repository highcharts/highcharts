(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ne-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ne-085', 10], ['us-ne-087', 11], ['us-ne-037', 12],
        ['us-ne-053', 13], ['us-ne-157', 14], ['us-ne-165', 15],
        ['us-ne-059', 16], ['us-ne-169', 17], ['us-ne-083', 18],
        ['us-ne-065', 19], ['us-ne-179', 20], ['us-ne-139', 21],
        ['us-ne-077', 22], ['us-ne-011', 23], ['us-ne-183', 24],
        ['us-ne-027', 25], ['us-ne-095', 26], ['us-ne-151', 27],
        ['us-ne-035', 28], ['us-ne-079', 29], ['us-ne-001', 30],
        ['us-ne-185', 31], ['us-ne-159', 32], ['us-ne-067', 33],
        ['us-ne-097', 34], ['us-ne-007', 35], ['us-ne-123', 36],
        ['us-ne-019', 37], ['us-ne-041', 38], ['us-ne-131', 39],
        ['us-ne-127', 40], ['us-ne-141', 41], ['us-ne-125', 42],
        ['us-ne-133', 43], ['us-ne-109', 44], ['us-ne-161', 45],
        ['us-ne-075', 46], ['us-ne-137', 47], ['us-ne-047', 48],
        ['us-ne-111', 49], ['us-ne-003', 50], ['us-ne-167', 51],
        ['us-ne-063', 52], ['us-ne-057', 53], ['us-ne-033', 54],
        ['us-ne-055', 55], ['us-ne-105', 56], ['us-ne-081', 57],
        ['us-ne-017', 58], ['us-ne-115', 59], ['us-ne-009', 60],
        ['us-ne-113', 61], ['us-ne-121', 62], ['us-ne-163', 63],
        ['us-ne-023', 64], ['us-ne-143', 65], ['us-ne-175', 66],
        ['us-ne-025', 67], ['us-ne-119', 68], ['us-ne-181', 69],
        ['us-ne-129', 70], ['us-ne-099', 71], ['us-ne-089', 72],
        ['us-ne-031', 73], ['us-ne-103', 74], ['us-ne-015', 75],
        ['us-ne-093', 76], ['us-ne-071', 77], ['us-ne-135', 78],
        ['us-ne-049', 79], ['us-ne-101', 80], ['us-ne-107', 81],
        ['us-ne-153', 82], ['us-ne-155', 83], ['us-ne-013', 84],
        ['us-ne-005', 85], ['us-ne-091', 86], ['us-ne-061', 87],
        ['us-ne-029', 88], ['us-ne-021', 89], ['us-ne-147', 90],
        ['us-ne-069', 91], ['us-ne-171', 92], ['us-ne-073', 93],
        ['us-ne-051', 94], ['us-ne-043', 95], ['us-ne-177', 96],
        ['us-ne-039', 97], ['us-ne-117', 98], ['us-ne-145', 99],
        ['us-ne-149', 100], ['us-ne-045', 101], ['us-ne-173', 102]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ne-all.topo.json">Nebraska</a>'
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
