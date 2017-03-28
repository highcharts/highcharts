// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-mr', 0],
    ['no-st', 1],
    ['no-ho', 2],
    ['no-sf', 3],
    ['no-va', 4],
    ['no-of', 5],
    ['no-nt', 6],
    ['no-ro', 7],
    ['no-bu', 8],
    ['no-vf', 9],
    ['no-fi', 10],
    ['no-no', 11],
    ['no-tr', 12],
    ['no-ak', 13],
    ['no-op', 14],
    ['no-he', 15],
    ['no-os', 16],
    ['no-te', 17],
    ['no-aa', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-all.js">Norway</a>'
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
