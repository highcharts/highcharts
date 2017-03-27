// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sv-un', 0],
    ['sv-li', 1],
    ['sv-pa', 2],
    ['sv-cu', 3],
    ['sv-so', 4],
    ['sv-ss', 5],
    ['sv-mo', 6],
    ['sv-sm', 7],
    ['sv-sv', 8],
    ['sv-us', 9],
    ['sv-ch', 10],
    ['sv-sa', 11],
    ['sv-ah', 12],
    ['sv-ca', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sv/sv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sv/sv-all.js">El Salvador</a>'
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
