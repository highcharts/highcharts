(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-la-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-la-087', 10], ['us-la-105', 11], ['us-la-051', 12],
        ['us-la-013', 13], ['us-la-069', 14], ['us-la-047', 15],
        ['us-la-077', 16], ['us-la-109', 17], ['us-la-115', 18],
        ['us-la-079', 19], ['us-la-019', 20], ['us-la-023', 21],
        ['us-la-007', 22], ['us-la-057', 23], ['us-la-035', 24],
        ['us-la-083', 25], ['us-la-103', 26], ['us-la-121', 27],
        ['us-la-125', 28], ['us-la-003', 29], ['us-la-089', 30],
        ['us-la-061', 31], ['us-la-073', 32], ['us-la-101', 33],
        ['us-la-037', 34], ['us-la-095', 35], ['us-la-113', 36],
        ['us-la-075', 37], ['us-la-045', 38], ['us-la-033', 39],
        ['us-la-029', 40], ['us-la-017', 41], ['us-la-081', 42],
        ['us-la-015', 43], ['us-la-031', 44], ['us-la-065', 45],
        ['us-la-107', 46], ['us-la-021', 47], ['us-la-049', 48],
        ['us-la-039', 49], ['us-la-071', 50], ['us-la-099', 51],
        ['us-la-059', 52], ['us-la-009', 53], ['us-la-053', 54],
        ['us-la-011', 55], ['us-la-055', 56], ['us-la-027', 57],
        ['us-la-025', 58], ['us-la-117', 59], ['us-la-067', 60],
        ['us-la-091', 61], ['us-la-041', 62], ['us-la-123', 63],
        ['us-la-093', 64], ['us-la-005', 65], ['us-la-063', 66],
        ['us-la-111', 67], ['us-la-127', 68], ['us-la-043', 69],
        ['us-la-119', 70], ['us-la-085', 71], ['us-la-001', 72],
        ['us-la-097', 73]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-la-all.topo.json">Louisiana</a>'
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
