// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bt-ty', 0],
    ['bt-sg', 1],
    ['bt-to', 2],
    ['bt-wp', 3],
    ['bt-mo', 4],
    ['bt-pm', 5],
    ['bt-sj', 6],
    ['bt-ta', 7],
    ['bt-ck', 8],
    ['bt-da', 9],
    ['bt-ha', 10],
    ['bt-pr', 11],
    ['bt-sm', 12],
    ['bt-tm', 13],
    ['bt-ga', 14],
    ['bt-pn', 15],
    ['bt-cr', 16],
    ['bt-ge', 17],
    ['bt-bu', 18],
    ['bt-lh', 19]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bt/bt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bt/bt-all.js">Bhutan</a>'
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
