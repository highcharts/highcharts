(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-wv-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-wv-103', 10], ['us-wv-067', 11], ['us-wv-015', 12],
        ['us-wv-003', 13], ['us-wv-095', 14], ['us-wv-019', 15],
        ['us-wv-039', 16], ['us-wv-009', 17], ['us-wv-069', 18],
        ['us-wv-043', 19], ['us-wv-061', 20], ['us-wv-033', 21],
        ['us-wv-027', 22], ['us-wv-071', 23], ['us-wv-023', 24],
        ['us-wv-031', 25], ['us-wv-089', 26], ['us-wv-011', 27],
        ['us-wv-053', 28], ['us-wv-101', 29], ['us-wv-025', 30],
        ['us-wv-041', 31], ['us-wv-077', 32], ['us-wv-017', 33],
        ['us-wv-021', 34], ['us-wv-087', 35], ['us-wv-001', 36],
        ['us-wv-055', 37], ['us-wv-047', 38], ['us-wv-109', 39],
        ['us-wv-059', 40], ['us-wv-073', 41], ['us-wv-085', 42],
        ['us-wv-107', 43], ['us-wv-099', 44], ['us-wv-093', 45],
        ['us-wv-105', 46], ['us-wv-013', 47], ['us-wv-091', 48],
        ['us-wv-083', 49], ['us-wv-079', 50], ['us-wv-081', 51],
        ['us-wv-029', 52], ['us-wv-057', 53], ['us-wv-075', 54],
        ['us-wv-007', 55], ['us-wv-037', 56], ['us-wv-049', 57],
        ['us-wv-063', 58], ['us-wv-051', 59], ['us-wv-035', 60],
        ['us-wv-065', 61], ['us-wv-097', 62], ['us-wv-045', 63],
        ['us-wv-005', 64]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wv-all.topo.json">West Virginia</a>'
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
