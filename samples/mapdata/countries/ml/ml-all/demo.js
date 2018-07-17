// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ml-6392', 0],
    ['ml-tb', 1],
    ['ml-kd', 2],
    ['ml-ga', 3],
    ['ml-ky', 4],
    ['ml-sk', 5],
    ['ml-mo', 6],
    ['ml-sg', 7],
    ['ml-kk', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ml/ml-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ml/ml-all.js">Mali</a>'
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
