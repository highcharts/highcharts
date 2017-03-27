// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-on-3559', 0],
    ['ca-on-3558', 1],
    ['ca-on-3511', 2],
    ['ca-on-3510', 3],
    ['ca-on-3544', 4],
    ['ca-on-3560', 5],
    ['ca-on-3551', 6],
    ['ca-on-3506', 7],
    ['ca-on-3507', 8],
    ['ca-on-3520', 9],
    ['ca-on-3521', 10],
    ['ca-on-3502', 11],
    ['ca-on-3556', 12],
    ['ca-on-3540', 13],
    ['ca-on-3523', 14],
    ['ca-on-3541', 15],
    ['ca-on-3518', 16],
    ['ca-on-3519', 17],
    ['ca-on-3542', 18],
    ['ca-on-3543', 19],
    ['ca-on-3538', 20],
    ['ca-on-3539', 21],
    ['ca-on-3531', 22],
    ['ca-on-3514', 23],
    ['ca-on-3513', 24],
    ['ca-on-3512', 25],
    ['ca-on-3548', 26],
    ['ca-on-3552', 27],
    ['ca-on-3516', 28],
    ['ca-on-3515', 29],
    ['ca-on-3557', 30],
    ['ca-on-3528', 31],
    ['ca-on-3532', 32],
    ['ca-on-3530', 33],
    ['ca-on-3534', 34],
    ['ca-on-3536', 35],
    ['ca-on-3537', 36],
    ['ca-on-3547', 37],
    ['ca-on-3509', 38],
    ['ca-on-3529', 39],
    ['ca-on-3549', 40],
    ['ca-on-3546', 41],
    ['ca-on-3526', 42],
    ['ca-on-3524', 43],
    ['ca-on-3525', 44],
    ['ca-on-3522', 45],
    ['ca-on-3501', 46],
    ['ca-on-3554', 47],
    ['ca-on-3553', 48]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-on-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-on-all.js">Ontario</a>'
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
