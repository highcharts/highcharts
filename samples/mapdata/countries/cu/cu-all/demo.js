// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cu-ho', 0],
    ['cu-ar', 1],
    ['cu-ma', 2],
    ['cu-vc', 3],
    ['cu-5812', 4],
    ['cu-ij', 5],
    ['cu-ss', 6],
    ['cu-ca', 7],
    ['cu-cm', 8],
    ['cu-ch', 9],
    ['cu-cf', 10],
    ['cu-gu', 11],
    ['cu-gr', 12],
    ['cu-lt', 13],
    ['cu-sc', 14],
    ['cu-mq', 15],
    ['cu-pr', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cu/cu-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cu/cu-all.js">Cuba</a>'
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
