// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bf-ka', 0],
    ['bf-ob', 1],
    ['bf-pa', 2],
    ['bf-zm', 3],
    ['bf-sg', 4],
    ['bf-ss', 5],
    ['bf-zr', 6],
    ['bf-lo', 7],
    ['bf-yt', 8],
    ['bf-nm', 9],
    ['bf-st', 10],
    ['bf-bl', 11],
    ['bf-kl', 12],
    ['bf-gz', 13],
    ['bf-kr', 14],
    ['bf-nr', 15],
    ['bf-zw', 16],
    ['bf-io', 17],
    ['bf-bb', 18],
    ['bf-tu', 19],
    ['bf-le', 20],
    ['bf-km', 21],
    ['bf-po', 22],
    ['bf-gg', 23],
    ['bf-kj', 24],
    ['bf-se', 25],
    ['bf-yg', 26],
    ['bf-ta', 27],
    ['bf-7399', 28],
    ['bf-kp', 29],
    ['bf-gm', 30],
    ['bf-ho', 31],
    ['bf-kn', 32],
    ['bf-bw', 33],
    ['bf-ks', 34],
    ['bf-ba', 35],
    ['bf-mo', 36],
    ['bf-od', 37],
    ['bf-sm', 38],
    ['bf-ny', 39],
    ['bf-sr', 40],
    ['bf-bm', 41],
    ['bf-bk', 42],
    ['bf-kw', 43],
    ['bf-bz', 44]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bf/bf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bf/bf-all.js">Burkina Faso</a>'
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
