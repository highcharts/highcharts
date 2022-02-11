(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-ca-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-ca-083', 10], ['us-ca-111', 11], ['us-ca-071', 12],
        ['us-ca-115', 13], ['us-ca-101', 14], ['us-ca-031', 15],
        ['us-ca-053', 16], ['us-ca-057', 17], ['us-ca-059', 18],
        ['us-ca-065', 19], ['us-ca-073', 20], ['us-ca-041', 21],
        ['us-ca-075', 22], ['us-ca-095', 23], ['us-ca-097', 24],
        ['us-ca-055', 25], ['us-ca-013', 26], ['us-ca-009', 27],
        ['us-ca-077', 28], ['us-ca-035', 29], ['us-ca-091', 30],
        ['us-ca-067', 31], ['us-ca-017', 32], ['us-ca-099', 33],
        ['us-ca-061', 34], ['us-ca-043', 35], ['us-ca-063', 36],
        ['us-ca-049', 37], ['us-ca-089', 38], ['us-ca-109', 39],
        ['us-ca-039', 40], ['us-ca-003', 41], ['us-ca-069', 42],
        ['us-ca-047', 43], ['us-ca-079', 44], ['us-ca-011', 45],
        ['us-ca-007', 46], ['us-ca-081', 47], ['us-ca-087', 48],
        ['us-ca-085', 49], ['us-ca-029', 50], ['us-ca-005', 51],
        ['us-ca-113', 52], ['us-ca-033', 53], ['us-ca-045', 54],
        ['us-ca-103', 55], ['us-ca-023', 56], ['us-ca-093', 57],
        ['us-ca-027', 58], ['us-ca-001', 59], ['us-ca-037', 60],
        ['us-ca-025', 61], ['us-ca-021', 62], ['us-ca-107', 63],
        ['us-ca-019', 64], ['us-ca-015', 65], ['us-ca-105', 66],
        ['us-ca-051', 67]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ca-all.topo.json">California</a>'
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
