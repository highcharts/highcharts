// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-in-3430', 0],
    ['no-in-3427', 1],
    ['no-in-3426', 2],
    ['no-in-3425', 3],
    ['no-in-3421', 4],
    ['no-in-3424', 5],
    ['no-in-3429', 6],
    ['no-in-3423', 7],
    ['no-in-3441', 8],
    ['no-in-3451', 9],
    ['no-in-3443', 10],
    ['no-in-3452', 11],
    ['no-in-3428', 12],
    ['no-in-3435', 13],
    ['no-in-3453', 14],
    ['no-in-3431', 15],
    ['no-in-3436', 16],
    ['no-in-3416', 17],
    ['no-in-3450', 18],
    ['no-in-3454', 19],
    ['no-in-3446', 20],
    ['no-in-3439', 21],
    ['no-in-3442', 22],
    ['no-in-3419', 23],
    ['no-in-3401', 24],
    ['no-in-3420', 25],
    ['no-in-3432', 26],
    ['no-in-3422', 27],
    ['no-in-3412', 28],
    ['no-in-3434', 29],
    ['no-in-3449', 30],
    ['no-in-3413', 31],
    ['no-in-3447', 32],
    ['no-in-3418', 33],
    ['no-in-3440', 34],
    ['no-in-3411', 35],
    ['no-in-3414', 36],
    ['no-in-3433', 37],
    ['no-in-3415', 38],
    ['no-in-3417', 39],
    ['no-in-3448', 40],
    ['no-in-3405', 41],
    ['no-in-3403', 42],
    ['no-in-3407', 43],
    ['no-in-3438', 44],
    ['no-in-3437', 45]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-in-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-in-all.js">Innlandet</a>'
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
