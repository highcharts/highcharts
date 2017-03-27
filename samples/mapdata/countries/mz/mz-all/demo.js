// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mz-nm', 0],
    ['mz-in', 1],
    ['mz-mp', 2],
    ['mz-za', 3],
    ['mz-7278', 4],
    ['mz-te', 5],
    ['mz-mn', 6],
    ['mz-cd', 7],
    ['mz-ns', 8],
    ['mz-ga', 9],
    ['mz-so', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mz/mz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mz/mz-all.js">Mozambique</a>'
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
