// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tw-pt', 0],
    ['tw-tn', 1],
    ['tw-il', 2],
    ['tw-ch', 3],
    ['tw-tt', 4],
    ['tw-ph', 5],
    ['tw-km', 6],
    ['tw-lk', 7],
    ['tw-tw', 8],
    ['tw-cs', 9],
    ['tw-th', 10],
    ['tw-yl', 11],
    ['tw-kh', 12],
    ['tw-tp', 13],
    ['tw-hs', 14],
    ['tw-hh', 15],
    ['tw-cl', 16],
    ['tw-ml', 17],
    ['tw-ty', 18],
    ['tw-cg', 19],
    ['tw-hl', 20],
    ['tw-nt', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tw/tw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tw/tw-all.js">Taiwan</a>'
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
