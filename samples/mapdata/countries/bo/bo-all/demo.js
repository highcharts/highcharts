// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bo-lp', 0],
    ['bo-cb', 1],
    ['bo-cq', 2],
    ['bo-eb', 3],
    ['bo-or', 4],
    ['bo-po', 5],
    ['bo-sc', 6],
    ['bo-tr', 7],
    ['bo-pa', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bo/bo-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bo/bo-all.js">Bolivia</a>'
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
