// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sm-6415', 0],
    ['sm-6416', 1],
    ['sm-6417', 2],
    ['sm-3634', 3],
    ['sm-6410', 4],
    ['sm-6411', 5],
    ['sm-6412', 6],
    ['sm-6413', 7],
    ['sm-6414', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sm/sm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sm/sm-all.js">San Marino</a>'
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
