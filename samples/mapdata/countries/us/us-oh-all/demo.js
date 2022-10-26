(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-oh-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-oh-085', 10], ['us-oh-035', 11], ['us-oh-103', 12],
        ['us-oh-153', 13], ['us-oh-063', 14], ['us-oh-173', 15],
        ['us-oh-039', 16], ['us-oh-077', 17], ['us-oh-093', 18],
        ['us-oh-145', 19], ['us-oh-087', 20], ['us-oh-015', 21],
        ['us-oh-001', 22], ['us-oh-049', 23], ['us-oh-067', 24],
        ['us-oh-013', 25], ['us-oh-081', 26], ['us-oh-105', 27],
        ['us-oh-163', 28], ['us-oh-079', 29], ['us-oh-009', 30],
        ['us-oh-059', 31], ['us-oh-031', 32], ['us-oh-129', 33],
        ['us-oh-097', 34], ['us-oh-045', 35], ['us-oh-047', 36],
        ['us-oh-141', 37], ['us-oh-071', 38], ['us-oh-101', 39],
        ['us-oh-065', 40], ['us-oh-149', 41], ['us-oh-091', 42],
        ['us-oh-161', 43], ['us-oh-137', 44], ['us-oh-133', 45],
        ['us-oh-155', 46], ['us-oh-055', 47], ['us-oh-007', 48],
        ['us-oh-143', 49], ['us-oh-147', 50], ['us-oh-165', 51],
        ['us-oh-017', 52], ['us-oh-113', 53], ['us-oh-033', 54],
        ['us-oh-061', 55], ['us-oh-073', 56], ['us-oh-037', 57],
        ['us-oh-019', 58], ['us-oh-151', 59], ['us-oh-075', 60],
        ['us-oh-099', 61], ['us-oh-005', 62], ['us-oh-041', 63],
        ['us-oh-083', 64], ['us-oh-011', 65], ['us-oh-089', 66],
        ['us-oh-095', 67], ['us-oh-069', 68], ['us-oh-171', 69],
        ['us-oh-157', 70], ['us-oh-127', 71], ['us-oh-131', 72],
        ['us-oh-025', 73], ['us-oh-027', 74], ['us-oh-159', 75],
        ['us-oh-021', 76], ['us-oh-109', 77], ['us-oh-003', 78],
        ['us-oh-023', 79], ['us-oh-107', 80], ['us-oh-053', 81],
        ['us-oh-117', 82], ['us-oh-111', 83], ['us-oh-135', 84],
        ['us-oh-119', 85], ['us-oh-139', 86], ['us-oh-051', 87],
        ['us-oh-167', 88], ['us-oh-175', 89], ['us-oh-169', 90],
        ['us-oh-115', 91], ['us-oh-057', 92], ['us-oh-043', 93],
        ['us-oh-125', 94], ['us-oh-029', 95], ['us-oh-123', 96],
        ['us-oh-121', 97]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-oh-all.topo.json">Ohio</a>'
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
