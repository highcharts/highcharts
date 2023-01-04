(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-co-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-co-069', 10], ['us-co-013', 11], ['us-co-014', 12],
        ['us-co-025', 13], ['us-co-101', 14], ['us-co-041', 15],
        ['us-co-063', 16], ['us-co-073', 17], ['us-co-109', 18],
        ['us-co-003', 19], ['us-co-059', 20], ['us-co-015', 21],
        ['us-co-043', 22], ['us-co-005', 23], ['us-co-031', 24],
        ['us-co-045', 25], ['us-co-123', 26], ['us-co-075', 27],
        ['us-co-115', 28], ['us-co-011', 29], ['us-co-053', 30],
        ['us-co-091', 31], ['us-co-113', 32], ['us-co-071', 33],
        ['us-co-001', 34], ['us-co-121', 35], ['us-co-057', 36],
        ['us-co-007', 37], ['us-co-105', 38], ['us-co-035', 39],
        ['us-co-119', 40], ['us-co-125', 41], ['us-co-093', 42],
        ['us-co-065', 43], ['us-co-055', 44], ['us-co-097', 45],
        ['us-co-107', 46], ['us-co-077', 47], ['us-co-051', 48],
        ['us-co-087', 49], ['us-co-009', 50], ['us-co-049', 51],
        ['us-co-047', 52], ['us-co-111', 53], ['us-co-021', 54],
        ['us-co-117', 55], ['us-co-033', 56], ['us-co-023', 57],
        ['us-co-039', 58], ['us-co-061', 59], ['us-co-089', 60],
        ['us-co-079', 61], ['us-co-027', 62], ['us-co-037', 63],
        ['us-co-085', 64], ['us-co-095', 65], ['us-co-029', 66],
        ['us-co-099', 67], ['us-co-081', 68], ['us-co-083', 69],
        ['us-co-103', 70], ['us-co-017', 71], ['us-co-067', 72],
        ['us-co-019', 73]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-co-all.topo.json">Colorado</a>'
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
