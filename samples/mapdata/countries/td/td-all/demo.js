// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['td-ma', 0],
    ['td-sa', 1],
    ['td-nj', 2],
    ['td-lo', 3],
    ['td-mw', 4],
    ['td-br', 5],
    ['td-ti', 6],
    ['td-en', 7],
    ['td-cg', 8],
    ['td-bg', 9],
    ['td-si', 10],
    ['td-mo', 11],
    ['td-hd', 12],
    ['td-km', 13],
    ['td-lc', 14],
    ['td-bi', 15],
    ['td-ba', 16],
    ['td-gr', 17],
    ['td-oa', 18],
    ['td-lr', 19],
    ['td-me', 20],
    ['td-ta', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/td/td-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/td/td-all.js">Chad</a>'
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
