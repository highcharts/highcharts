// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-wy-011', 0],
    ['us-wy-023', 1],
    ['us-wy-037', 2],
    ['us-wy-039', 3],
    ['us-wy-005', 4],
    ['us-wy-027', 5],
    ['us-wy-009', 6],
    ['us-wy-045', 7],
    ['us-wy-031', 8],
    ['us-wy-021', 9],
    ['us-wy-019', 10],
    ['us-wy-043', 11],
    ['us-wy-033', 12],
    ['us-wy-029', 13],
    ['us-wy-013', 14],
    ['us-wy-007', 15],
    ['us-wy-001', 16],
    ['us-wy-035', 17],
    ['us-wy-041', 18],
    ['us-wy-025', 19],
    ['us-wy-015', 20],
    ['us-wy-017', 21],
    ['us-wy-003', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-wy-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-wy-all.js">Wyoming</a>'
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
