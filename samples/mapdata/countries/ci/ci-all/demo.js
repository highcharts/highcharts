// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ci-sc', 0],
    ['ci-3397', 1],
    ['ci-de', 2],
    ['ci-bf', 3],
    ['ci-ba', 4],
    ['ci-wr', 5],
    ['ci-zu', 6],
    ['ci-fr', 7],
    ['ci-3404', 8],
    ['ci-la', 9],
    ['ci-so', 10],
    ['ci-za', 11],
    ['ci-vb', 12],
    ['ci-av', 13],
    ['ci-bg', 14],
    ['ci-ab', 15],
    ['ci-3412', 16],
    ['ci-3413', 17],
    ['ci-tm', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ci/ci-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ci/ci-all.js">Ivory Coast</a>'
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
