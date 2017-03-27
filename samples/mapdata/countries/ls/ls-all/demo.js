// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ls-be', 0],
    ['ls-ms', 1],
    ['ls-mh', 2],
    ['ls-qt', 3],
    ['ls-le', 4],
    ['ls-bb', 5],
    ['ls-mk', 6],
    ['ls-qn', 7],
    ['ls-tt', 8],
    ['ls-mf', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ls/ls-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ls/ls-all.js">Lesotho</a>'
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
