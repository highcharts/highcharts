// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['et-be', 0],
    ['et-2837', 1],
    ['et-ha', 2],
    ['et-sn', 3],
    ['et-ga', 4],
    ['et-aa', 5],
    ['et-so', 6],
    ['et-dd', 7],
    ['et-ti', 8],
    ['et-af', 9],
    ['et-am', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/et/et-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/et/et-all.js">Ethiopia</a>'
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
