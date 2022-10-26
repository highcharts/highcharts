(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-al-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-al-007', 10], ['us-al-003', 11], ['us-al-041', 12],
        ['us-al-085', 13], ['us-al-133', 14], ['us-al-059', 15],
        ['us-al-083', 16], ['us-al-079', 17], ['us-al-039', 18],
        ['us-al-061', 19], ['us-al-095', 20], ['us-al-071', 21],
        ['us-al-009', 22], ['us-al-055', 23], ['us-al-013', 24],
        ['us-al-053', 25], ['us-al-099', 26], ['us-al-131', 27],
        ['us-al-077', 28], ['us-al-033', 29], ['us-al-105', 30],
        ['us-al-091', 31], ['us-al-107', 32], ['us-al-119', 33],
        ['us-al-097', 34], ['us-al-063', 35], ['us-al-047', 36],
        ['us-al-001', 37], ['us-al-101', 38], ['us-al-073', 39],
        ['us-al-021', 40], ['us-al-129', 41], ['us-al-023', 42],
        ['us-al-031', 43], ['us-al-029', 44], ['us-al-121', 45],
        ['us-al-043', 46], ['us-al-045', 47], ['us-al-019', 48],
        ['us-al-109', 49], ['us-al-035', 50], ['us-al-123', 51],
        ['us-al-111', 52], ['us-al-037', 53], ['us-al-027', 54],
        ['us-al-093', 55], ['us-al-127', 56], ['us-al-011', 57],
        ['us-al-113', 58], ['us-al-117', 59], ['us-al-065', 60],
        ['us-al-081', 61], ['us-al-089', 62], ['us-al-025', 63],
        ['us-al-015', 64], ['us-al-103', 65], ['us-al-017', 66],
        ['us-al-067', 67], ['us-al-069', 68], ['us-al-049', 69],
        ['us-al-005', 70], ['us-al-057', 71], ['us-al-125', 72],
        ['us-al-087', 73], ['us-al-075', 74], ['us-al-115', 75],
        ['us-al-051', 76]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-al-all.topo.json">Alabama</a>'
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
