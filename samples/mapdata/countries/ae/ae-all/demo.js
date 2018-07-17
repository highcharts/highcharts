// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ae-az', 0],
    ['ae-du', 1],
    ['ae-sh', 2],
    ['ae-rk', 3],
    ['ae-uq', 4],
    ['ae-fu', 5],
    ['ae-740', 6],
    ['ae-aj', 7],
    ['ae-742', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ae/ae-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ae/ae-all.js">United Arab Emirates</a>'
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
