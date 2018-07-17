// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-az-011', 0],
    ['us-az-001', 1],
    ['us-az-003', 2],
    ['us-az-012', 3],
    ['us-az-013', 4],
    ['us-az-005', 5],
    ['us-az-007', 6],
    ['us-az-021', 7],
    ['us-az-009', 8],
    ['us-az-015', 9],
    ['us-az-017', 10],
    ['us-az-027', 11],
    ['us-az-023', 12],
    ['us-az-025', 13],
    ['us-az-019', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-az-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-az-all.js">Arizona</a>'
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
