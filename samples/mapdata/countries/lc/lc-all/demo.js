// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['lc-6591', 0],
    ['lc-6585', 1],
    ['lc-6586', 2],
    ['lc-3607', 3],
    ['lc-6590', 4],
    ['lc-6588', 5],
    ['lc-6587', 6],
    ['lc-6592', 7],
    ['lc-6589', 8],
    ['lc-6593', 9],
    ['lc-6594', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/lc/lc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lc/lc-all.js">Saint Lucia</a>'
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
