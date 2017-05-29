// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['lr-gp', 0],
    ['lr-bg', 1],
    ['lr-586', 2],
    ['lr-cm', 3],
    ['lr-lf', 4],
    ['lr-mo', 5],
    ['lr-mg', 6],
    ['lr-ni', 7],
    ['lr-ri', 8],
    ['lr-gd', 9],
    ['lr-si', 10],
    ['lr-rg', 11],
    ['lr-gk', 12],
    ['lr-my', 13],
    ['lr-bm', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/lr/lr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lr/lr-all.js">Liberia</a>'
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
