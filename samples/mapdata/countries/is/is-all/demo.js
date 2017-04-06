// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['is-ne', 0],
    ['is-sl', 1],
    ['is-su', 2],
    ['is-ho', 3],
    ['is-6642', 4],
    ['is-vf', 5],
    ['is-al', 6],
    ['is-vl', 7],
    ['is-nv', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/is/is-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/is/is-all.js">Iceland</a>'
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
