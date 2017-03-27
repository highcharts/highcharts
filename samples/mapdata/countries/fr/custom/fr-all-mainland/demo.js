// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-t', 0],
    ['fr-e', 1],
    ['fr-r', 2],
    ['fr-u', 3],
    ['fr-n', 4],
    ['fr-p', 5],
    ['fr-o', 6],
    ['fr-v', 7],
    ['fr-s', 8],
    ['fr-g', 9],
    ['fr-k', 10],
    ['fr-a', 11],
    ['fr-c', 12],
    ['fr-f', 13],
    ['fr-l', 14],
    ['fr-d', 15],
    ['fr-b', 16],
    ['fr-i', 17],
    ['fr-q', 18],
    ['fr-j', 19],
    ['fr-m', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/custom/fr-all-mainland'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.js">France, mainland</a>'
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
