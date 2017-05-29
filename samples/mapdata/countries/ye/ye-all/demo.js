// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ye-3662', 0],
    ['ye-hu', 1],
    ['ye-3415', 2],
    ['ye-3427', 3],
    ['ye-ta', 4],
    ['ye-sd', 5],
    ['ye-mw', 6],
    ['ye-dh', 7],
    ['ye-hj', 8],
    ['ye-am', 9],
    ['ye-ib', 10],
    ['ye-la', 11],
    ['ye-mr', 12],
    ['ye-ba', 13],
    ['ye-dl', 14],
    ['ye-ja', 15],
    ['ye-sh', 16],
    ['ye-ma', 17],
    ['ye-3426', 18],
    ['ye-3428', 19],
    ['ye-ad', 20],
    ['ye-3430', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ye/ye-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ye/ye-all.js">Yemen</a>'
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
