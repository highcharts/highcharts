(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-mn-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-mn-051', 10], ['us-mn-149', 11], ['us-mn-019', 12],
        ['us-mn-143', 13], ['us-mn-151', 14], ['us-mn-169', 15],
        ['us-mn-045', 16], ['us-mn-005', 17], ['us-mn-057', 18],
        ['us-mn-173', 19], ['us-mn-041', 20], ['us-mn-121', 21],
        ['us-mn-077', 22], ['us-mn-007', 23], ['us-mn-037', 24],
        ['us-mn-131', 25], ['us-mn-147', 26], ['us-mn-013', 27],
        ['us-mn-161', 28], ['us-mn-033', 29], ['us-mn-127', 30],
        ['us-mn-081', 31], ['us-mn-135', 32], ['us-mn-089', 33],
        ['us-mn-113', 34], ['us-mn-159', 35], ['us-mn-111', 36],
        ['us-mn-153', 37], ['us-mn-097', 38], ['us-mn-021', 39],
        ['us-mn-101', 40], ['us-mn-167', 41], ['us-mn-155', 42],
        ['us-mn-165', 43], ['us-mn-053', 44], ['us-mn-079', 45],
        ['us-mn-065', 46], ['us-mn-059', 47], ['us-mn-115', 48],
        ['us-mn-063', 49], ['us-mn-011', 50], ['us-mn-107', 51],
        ['us-mn-055', 52], ['us-mn-099', 53], ['us-mn-109', 54],
        ['us-mn-047', 55], ['us-mn-039', 56], ['us-mn-093', 57],
        ['us-mn-171', 58], ['us-mn-073', 59], ['us-mn-067', 60],
        ['us-mn-023', 61], ['us-mn-137', 62], ['us-mn-105', 63],
        ['us-mn-071', 64], ['us-mn-049', 65], ['us-mn-025', 66],
        ['us-mn-003', 67], ['us-mn-015', 68], ['us-mn-083', 69],
        ['us-mn-133', 70], ['us-mn-117', 71], ['us-mn-163', 72],
        ['us-mn-069', 73], ['us-mn-029', 74], ['us-mn-119', 75],
        ['us-mn-043', 76], ['us-mn-145', 77], ['us-mn-009', 78],
        ['us-mn-095', 79], ['us-mn-141', 80], ['us-mn-123', 81],
        ['us-mn-129', 82], ['us-mn-085', 83], ['us-mn-017', 84],
        ['us-mn-075', 85], ['us-mn-001', 86], ['us-mn-091', 87],
        ['us-mn-027', 88], ['us-mn-087', 89], ['us-mn-157', 90],
        ['us-mn-031', 91], ['us-mn-103', 92], ['us-mn-125', 93],
        ['us-mn-061', 94], ['us-mn-035', 95], ['us-mn-139', 96]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-mn-all.topo.json">Minnesota</a>'
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
