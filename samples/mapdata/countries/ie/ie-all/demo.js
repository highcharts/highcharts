// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ie-5551', 0],
    ['ie-1510', 1],
    ['ie-mo', 2],
    ['ie-ky', 3],
    ['ie-dl', 4],
    ['ie-491', 5],
    ['ie-ce', 6],
    ['ie-7034', 7],
    ['ie-7035', 8],
    ['ie-ld', 9],
    ['ie-cn', 10],
    ['ie-2363', 11],
    ['ie-mn', 12],
    ['ie-gy', 13],
    ['ie-ck', 14],
    ['ie-wd', 15],
    ['ie-7033', 16],
    ['ie-1528', 17],
    ['ie-dn', 18],
    ['ie-lh', 19],
    ['ie-mh', 20],
    ['ie-oy', 21],
    ['ie-wh', 22],
    ['ie-wx', 23],
    ['ie-cw', 24],
    ['ie-ww', 25],
    ['ie-ke', 26],
    ['ie-kk', 27],
    ['ie-ls', 28],
    ['ie-ty', 29],
    ['ie-1533', 30],
    ['ie-lk', 31],
    ['ie-rn', 32],
    ['ie-so', 33],
    ['ie-lm', 34]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ie/ie-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ie/ie-all.js">Ireland</a>'
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
