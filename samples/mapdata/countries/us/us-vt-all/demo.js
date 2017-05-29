// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['us-vt-013', 0],
    ['us-vt-009', 1],
    ['us-vt-011', 2],
    ['us-vt-007', 3],
    ['us-vt-015', 4],
    ['us-vt-021', 5],
    ['us-vt-003', 6],
    ['us-vt-017', 7],
    ['us-vt-027', 8],
    ['us-vt-005', 9],
    ['us-vt-019', 10],
    ['us-vt-025', 11],
    ['us-vt-001', 12],
    ['us-vt-023', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/us/us-vt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/us-vt-all.js">Vermont</a>'
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
