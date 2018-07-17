// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mw-6970', 0],
    ['mw-ma', 1],
    ['mw-de', 2],
    ['mw-li', 3],
    ['mw-do', 4],
    ['mw-mg', 5],
    ['mw-mc', 6],
    ['mw-nu', 7],
    ['mw-ni', 8],
    ['mw-sa', 9],
    ['mw-ba', 10],
    ['mw-ck', 11],
    ['mw-th', 12],
    ['mw-cr', 13],
    ['mw-ns', 14],
    ['mw-zo', 15],
    ['mw-bl', 16],
    ['mw-1649', 17],
    ['mw-mj', 18],
    ['mw-ph', 19],
    ['mw-mw', 20],
    ['mw-1011', 21],
    ['mw-ct', 22],
    ['mw-ks', 23],
    ['mw-mz', 24],
    ['mw-na', 25],
    ['mw-nk', 26],
    ['mw-ru', 27]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mw/mw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mw/mw-all.js">Malawi</a>'
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
