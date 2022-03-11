(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ok-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ok-037', 10], ['us-ok-081', 11], ['us-ok-049', 12],
        ['us-ok-051', 13], ['us-ok-059', 14], ['us-ok-151', 15],
        ['us-ok-011', 16], ['us-ok-017', 17], ['us-ok-075', 18],
        ['us-ok-015', 19], ['us-ok-137', 20], ['us-ok-141', 21],
        ['us-ok-033', 22], ['us-ok-083', 23], ['us-ok-103', 24],
        ['us-ok-001', 25], ['us-ok-041', 26], ['us-ok-107', 27],
        ['us-ok-039', 28], ['us-ok-009', 29], ['us-ok-055', 30],
        ['us-ok-057', 31], ['us-ok-019', 32], ['us-ok-095', 33],
        ['us-ok-093', 34], ['us-ok-073', 35], ['us-ok-035', 36],
        ['us-ok-123', 37], ['us-ok-125', 38], ['us-ok-131', 39],
        ['us-ok-147', 40], ['us-ok-071', 41], ['us-ok-047', 42],
        ['us-ok-021', 43], ['us-ok-109', 44], ['us-ok-023', 45],
        ['us-ok-005', 46], ['us-ok-087', 47], ['us-ok-079', 48],
        ['us-ok-061', 49], ['us-ok-003', 50], ['us-ok-077', 51],
        ['us-ok-027', 52], ['us-ok-045', 53], ['us-ok-007', 54],
        ['us-ok-031', 55], ['us-ok-067', 56], ['us-ok-119', 57],
        ['us-ok-111', 58], ['us-ok-145', 59], ['us-ok-129', 60],
        ['us-ok-043', 61], ['us-ok-117', 62], ['us-ok-143', 63],
        ['us-ok-091', 64], ['us-ok-069', 65], ['us-ok-135', 66],
        ['us-ok-101', 67], ['us-ok-013', 68], ['us-ok-089', 69],
        ['us-ok-115', 70], ['us-ok-063', 71], ['us-ok-121', 72],
        ['us-ok-029', 73], ['us-ok-149', 74], ['us-ok-025', 75],
        ['us-ok-105', 76], ['us-ok-113', 77], ['us-ok-053', 78],
        ['us-ok-085', 79], ['us-ok-127', 80], ['us-ok-139', 81],
        ['us-ok-153', 82], ['us-ok-065', 83], ['us-ok-097', 84],
        ['us-ok-099', 85], ['us-ok-133', 86]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ok-all.topo.json">Oklahoma</a>'
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
