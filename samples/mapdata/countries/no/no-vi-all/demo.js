// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-vi-3011', 0],
    ['no-vi-3049', 1],
    ['no-vi-3038', 2],
    ['no-vi-3045', 3],
    ['no-vi-3048', 4],
    ['no-vi-3005', 5],
    ['no-vi-3025', 6],
    ['no-vi-3002', 7],
    ['no-vi-5435', 8],
    ['no-vi-3030', 9],
    ['no-vi-3019', 10],
    ['no-os-3024', 11],
    ['no-vi-3032', 12],
    ['no-vi-3033', 13],
    ['no-in-3054', 14],
    ['no-vi-3003', 15],
    ['no-vi-3015', 16],
    ['no-vi-3016', 17],
    ['no-vi-3031', 18],
    ['no-vi-3029', 19],
    ['no-vi-3018', 20],
    ['no-vi-3017', 21],
    ['no-vi-3021', 22],
    ['no-vi-3022', 23],
    ['no-vi-3014', 24],
    ['no-vi-3028', 25],
    ['no-vi-3007', 26],
    ['no-vi-3052', 27],
    ['no-vi-3039', 28],
    ['no-vi-3001', 29],
    ['no-vi-3026', 30],
    ['no-vi-3004', 31],
    ['no-vi-3041', 32],
    ['no-vi-3037', 33],
    ['no-vi-3023', 34],
    ['no-vi-3034', 35],
    ['no-vi-3035', 36],
    ['no-vi-3051', 37],
    ['no-in-3053', 38],
    ['no-vi-3013', 39],
    ['no-vi-3012', 40],
    ['no-vi-3044', 41],
    ['no-vi-3040', 42],
    ['no-vi-3043', 43],
    ['no-vi-3042', 44],
    ['no-vi-3006', 45],
    ['no-vi-3050', 46],
    ['no-vi-3046', 47],
    ['no-vi-3047', 48],
    ['no-vi-3027', 49],
    ['no-vi-3036', 50]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-vi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-vi-all.js">Viken</a>'
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
