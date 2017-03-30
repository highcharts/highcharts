// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pa-ch', 0],
    ['pa-sb', 1],
    ['pa-vr', 2],
    ['pa-bc', 3],
    ['pa-nb', 4],
    ['pa-em', 5],
    ['pa-cl', 6],
    ['pa-he', 7],
    ['pa-ls', 8],
    ['pa-dr', 9],
    ['pa-1119', 10],
    ['pa-cc', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pa/pa-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pa/pa-all.js">Panama</a>'
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
