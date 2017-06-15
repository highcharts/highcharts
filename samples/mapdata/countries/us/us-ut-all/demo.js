// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ut-003', 0],
    ['us-ut-039', 1],
    ['us-ut-027', 2],
    ['us-ut-037', 3],
    ['us-ut-005', 4],
    ['us-ut-055', 5],
    ['us-ut-023', 6],
    ['us-ut-033', 7],
    ['us-ut-013', 8],
    ['us-ut-047', 9],
    ['us-ut-015', 10],
    ['us-ut-049', 11],
    ['us-ut-035', 12],
    ['us-ut-043', 13],
    ['us-ut-041', 14],
    ['us-ut-007', 15],
    ['us-ut-031', 16],
    ['us-ut-009', 17],
    ['us-ut-017', 18],
    ['us-ut-051', 19],
    ['us-ut-001', 20],
    ['us-ut-057', 21],
    ['us-ut-029', 22],
    ['us-ut-053', 23],
    ['us-ut-021', 24],
    ['us-ut-011', 25],
    ['us-ut-025', 26],
    ['us-ut-019', 27],
    ['us-ut-045', 28]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ut-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ut-all.js">Utah</a>'
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
