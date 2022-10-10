(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-sd-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-sd-129', 10], ['us-sd-041', 11], ['us-sd-067', 12],
        ['us-sd-043', 13], ['us-sd-045', 14], ['us-sd-107', 15],
        ['us-sd-061', 16], ['us-sd-097', 17], ['us-sd-087', 18],
        ['us-sd-079', 19], ['us-sd-099', 20], ['us-sd-051', 21],
        ['us-sd-039', 22], ['us-sd-103', 23], ['us-sd-025', 24],
        ['us-sd-005', 25], ['us-sd-011', 26], ['us-sd-057', 27],
        ['us-sd-109', 28], ['us-sd-037', 29], ['us-sd-015', 30],
        ['us-sd-023', 31], ['us-sd-059', 32], ['us-sd-115', 33],
        ['us-sd-085', 34], ['us-sd-053', 35], ['us-sd-105', 36],
        ['us-sd-063', 37], ['us-sd-019', 38], ['us-sd-137', 39],
        ['us-sd-055', 40], ['us-sd-031', 41], ['us-sd-069', 42],
        ['us-sd-093', 43], ['us-sd-089', 44], ['us-sd-073', 45],
        ['us-sd-013', 46], ['us-sd-049', 47], ['us-sd-077', 48],
        ['us-sd-111', 49], ['us-sd-003', 50], ['us-sd-021', 51],
        ['us-sd-117', 52], ['us-sd-119', 53], ['us-sd-027', 54],
        ['us-sd-017', 55], ['us-sd-071', 56], ['us-sd-127', 57],
        ['us-sd-081', 58], ['us-sd-029', 59], ['us-sd-033', 60],
        ['us-sd-007', 61], ['us-sd-035', 62], ['us-sd-009', 63],
        ['us-sd-101', 64], ['us-sd-125', 65], ['us-sd-135', 66],
        ['us-sd-121', 67], ['us-sd-095', 68], ['us-sd-123', 69],
        ['us-sd-083', 70], ['us-sd-091', 71], ['us-sd-047', 72],
        ['us-sd-113', 73], ['us-sd-065', 74], ['us-sd-075', 75]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-sd-all.topo.json">South Dakota</a>'
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
