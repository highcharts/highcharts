// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-md-047', 0],
    ['us-md-039', 1],
    ['us-md-037', 2],
    ['us-md-019', 3],
    ['us-md-027', 4],
    ['us-md-021', 5],
    ['us-md-031', 6],
    ['us-md-023', 7],
    ['us-md-003', 8],
    ['us-md-033', 9],
    ['us-md-017', 10],
    ['us-md-510', 11],
    ['us-md-005', 12],
    ['us-md-001', 13],
    ['us-md-043', 14],
    ['us-md-035', 15],
    ['us-md-041', 16],
    ['us-md-011', 17],
    ['us-md-045', 18],
    ['us-md-013', 19],
    ['us-md-015', 20],
    ['us-md-029', 21],
    ['us-md-009', 22],
    ['us-md-025', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-md-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-md-all.js">Maryland</a>'
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
