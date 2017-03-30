// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-ma-007', 0],
    ['us-ma-019', 1],
    ['us-ma-001', 2],
    ['us-ma-027', 3],
    ['us-ma-015', 4],
    ['us-ma-021', 5],
    ['us-ma-005', 6],
    ['us-ma-023', 7],
    ['us-ma-013', 8],
    ['us-ma-025', 9],
    ['us-ma-009', 10],
    ['us-ma-017', 11],
    ['us-ma-003', 12],
    ['us-ma-011', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-ma-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-ma-all.js">Massachusetts</a>'
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
