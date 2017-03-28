// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['jm-ha', 0],
    ['jm-ma', 1],
    ['jm-se', 2],
    ['jm-sj', 3],
    ['jm-tr', 4],
    ['jm-we', 5],
    ['jm-ki', 6],
    ['jm-po', 7],
    ['jm-sn', 8],
    ['jm-sc', 9],
    ['jm-sm', 10],
    ['jm-sd', 11],
    ['jm-st', 12],
    ['jm-cl', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/jm/jm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/jm/jm-all.js">Jamaica</a>'
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
