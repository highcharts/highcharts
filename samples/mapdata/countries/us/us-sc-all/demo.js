(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-sc-all.topo.json'
    ).then(response => response.json());

    // Prepare demo data. The data is joined to map using value of 'hc-key'
    // property by default. See API docs for 'joinBy' for more info on linking
    // data and map.
    const data = [
        ['us-sc-063', 10], ['us-sc-081', 11], ['us-sc-003', 12],
        ['us-sc-037', 13], ['us-sc-019', 14], ['us-sc-007', 15],
        ['us-sc-001', 16], ['us-sc-077', 17], ['us-sc-041', 18],
        ['us-sc-085', 19], ['us-sc-029', 20], ['us-sc-005', 21],
        ['us-sc-009', 22], ['us-sc-089', 23], ['us-sc-067', 24],
        ['us-sc-061', 25], ['us-sc-027', 26], ['us-sc-015', 27],
        ['us-sc-051', 28], ['us-sc-033', 29], ['us-sc-013', 30],
        ['us-sc-053', 31], ['us-sc-017', 32], ['us-sc-087', 33],
        ['us-sc-039', 34], ['us-sc-091', 35], ['us-sc-031', 36],
        ['us-sc-055', 37], ['us-sc-057', 38], ['us-sc-025', 39],
        ['us-sc-043', 40], ['us-sc-071', 41], ['us-sc-047', 42],
        ['us-sc-059', 43], ['us-sc-045', 44], ['us-sc-073', 45],
        ['us-sc-079', 46], ['us-sc-075', 47], ['us-sc-011', 48],
        ['us-sc-083', 49], ['us-sc-069', 50], ['us-sc-065', 51],
        ['us-sc-023', 52], ['us-sc-021', 53], ['us-sc-049', 54],
        ['us-sc-035', 55]
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
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-sc-all.topo.json">South Carolina</a>'
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
