// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-me-009', 0],
    ['us-me-029', 1],
    ['us-me-013', 2],
    ['us-me-027', 3],
    ['us-me-015', 4],
    ['us-me-019', 5],
    ['us-me-031', 6],
    ['us-me-005', 7],
    ['us-me-025', 8],
    ['us-me-021', 9],
    ['us-me-023', 10],
    ['us-me-001', 11],
    ['us-me-007', 12],
    ['us-me-003', 13],
    ['us-me-011', 14],
    ['us-me-017', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-me-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-me-all.js">Maine</a>'
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
