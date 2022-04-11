(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-wi-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-wi-111', 10], ['us-wi-049', 11], ['us-wi-003', 12],
        ['us-wi-007', 13], ['us-wi-113', 14], ['us-wi-021', 15],
        ['us-wi-001', 16], ['us-wi-085', 17], ['us-wi-099', 18],
        ['us-wi-017', 19], ['us-wi-019', 20], ['us-wi-087', 21],
        ['us-wi-115', 22], ['us-wi-069', 23], ['us-wi-055', 24],
        ['us-wi-027', 25], ['us-wi-125', 26], ['us-wi-041', 27],
        ['us-wi-047', 28], ['us-wi-137', 29], ['us-wi-045', 30],
        ['us-wi-105', 31], ['us-wi-127', 32], ['us-wi-005', 33],
        ['us-wi-093', 34], ['us-wi-033', 35], ['us-wi-107', 36],
        ['us-wi-119', 37], ['us-wi-101', 38], ['us-wi-053', 39],
        ['us-wi-035', 40], ['us-wi-083', 41], ['us-wi-009', 42],
        ['us-wi-079', 43], ['us-wi-089', 44], ['us-wi-103', 45],
        ['us-wi-023', 46], ['us-wi-133', 47], ['us-wi-057', 48],
        ['us-wi-123', 49], ['us-wi-025', 50], ['us-wi-051', 51],
        ['us-wi-135', 52], ['us-wi-139', 53], ['us-wi-061', 54],
        ['us-wi-097', 55], ['us-wi-015', 56], ['us-wi-063', 57],
        ['us-wi-073', 58], ['us-wi-013', 59], ['us-wi-121', 60],
        ['us-wi-129', 61], ['us-wi-091', 62], ['us-wi-141', 63],
        ['us-wi-043', 64], ['us-wi-065', 65], ['us-wi-117', 66],
        ['us-wi-077', 67], ['us-wi-067', 68], ['us-wi-078', 69],
        ['us-wi-131', 70], ['us-wi-109', 71], ['us-wi-037', 72],
        ['us-wi-039', 73], ['us-wi-081', 74], ['us-wi-011', 75],
        ['us-wi-029', 76], ['us-wi-095', 77], ['us-wi-075', 78],
        ['us-wi-031', 79], ['us-wi-059', 80], ['us-wi-071', 81]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wi-all.topo.json">Wisconsin</a>'
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
