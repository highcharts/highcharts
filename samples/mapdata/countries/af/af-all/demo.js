// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['af-kt', 0],
    ['af-pk', 1],
    ['af-gz', 2],
    ['af-bd', 3],
    ['af-nr', 4],
    ['af-kr', 5],
    ['af-kz', 6],
    ['af-ng', 7],
    ['af-tk', 8],
    ['af-bl', 9],
    ['af-kb', 10],
    ['af-kp', 11],
    ['af-2030', 12],
    ['af-la', 13],
    ['af-lw', 14],
    ['af-pv', 15],
    ['af-sm', 16],
    ['af-vr', 17],
    ['af-pt', 18],
    ['af-bg', 19],
    ['af-hr', 20],
    ['af-bk', 21],
    ['af-jw', 22],
    ['af-bm', 23],
    ['af-gr', 24],
    ['af-fb', 25],
    ['af-sp', 26],
    ['af-fh', 27],
    ['af-hm', 28],
    ['af-nm', 29],
    ['af-2014', 30],
    ['af-oz', 31],
    ['af-kd', 32],
    ['af-zb', 33]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/af/af-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/af/af-all.js">Afghanistan</a>'
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
