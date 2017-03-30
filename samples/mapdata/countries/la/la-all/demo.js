// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['la-ou', 0],
    ['la-ph', 1],
    ['la-bl', 2],
    ['la-kh', 3],
    ['la-at', 4],
    ['la-bk', 5],
    ['la-xe', 6],
    ['la-lm', 7],
    ['la-xa', 8],
    ['la-ch', 9],
    ['la-sl', 10],
    ['la-sv', 11],
    ['la-vt', 12],
    ['la-vi', 13],
    ['la-xi', 14],
    ['la-ho', 15],
    ['la-lp', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/la/la-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/la/la-all.js">Laos</a>'
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
