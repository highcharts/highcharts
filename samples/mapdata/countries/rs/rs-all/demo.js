// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['rs-jc', 0],
    ['rs-bg', 1],
    ['rs-jn', 2],
    ['rs-sd', 3],
    ['rs-pi', 4],
    ['rs-bo', 5],
    ['rs-zl', 6],
    ['rs-zc', 7],
    ['rs-sc', 8],
    ['rs-sn', 9],
    ['rs-br', 10],
    ['rs-sm', 11],
    ['rs-mr', 12],
    ['rs-ns', 13],
    ['rs-pd', 14],
    ['rs-pm', 15],
    ['rs-rn', 16],
    ['rs-rs', 17],
    ['rs-to', 18],
    ['rs-kb', 19],
    ['rs-ma', 20],
    ['rs-su', 21],
    ['rs-pc', 22],
    ['rs-ja', 23],
    ['rs-zj', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/rs/rs-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/rs/rs-all.js">Republic of Serbia</a>'
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
