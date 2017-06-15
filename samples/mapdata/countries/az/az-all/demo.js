// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['az-cf', 0],
    ['az-sh', 1],
    ['az-qz', 2],
    ['az-ba', 3],
    ['az-6369', 4],
    ['az-sa', 5],
    ['az-ga', 6],
    ['az-xr', 7],
    ['az-na', 8],
    ['az-gr', 9],
    ['az-ka', 10],
    ['az-yv', 11],
    ['az-as', 12],
    ['az-dv', 13],
    ['az-bs', 14],
    ['az-st', 15],
    ['az-sq', 16],
    ['az-xi', 17],
    ['az-si', 18],
    ['az-qa', 19],
    ['az-qb', 20],
    ['az-805', 21],
    ['az-xd', 22],
    ['az-qd', 23],
    ['az-2051', 24],
    ['az-xc', 25],
    ['az-bb', 26],
    ['az-la', 27],
    ['az-sl', 28],
    ['az-ab', 29],
    ['az-sb', 30],
    ['az-7025', 31],
    ['az-kg', 32],
    ['az-af', 33],
    ['az-ds', 34],
    ['az-sx', 35],
    ['az-to', 36],
    ['az-ta', 37],
    ['az-am', 38],
    ['az-ha', 39],
    ['az-au', 40],
    ['az-br', 41],
    ['az-yr', 42],
    ['az-cl', 43],
    ['az-zg', 44],
    ['az-cb', 45],
    ['az-zr', 46],
    ['az-bq', 47],
    ['az-im', 48],
    ['az-ku', 49],
    ['az-uc', 50],
    ['az-gy', 51],
    ['az-is', 52],
    ['az-ln', 53],
    ['az-ma', 54],
    ['az-ne', 55],
    ['az-ac', 56],
    ['az-og', 57],
    ['az-qx', 58],
    ['az-sk', 59],
    ['az-qr', 60],
    ['az-xz', 61],
    ['az-zq', 62],
    ['az-bl', 63],
    ['az-sd', 64],
    ['az-or', 65],
    ['az-sr', 66],
    ['az-gd', 67],
    ['az-sm', 68],
    ['az-ar', 69],
    ['az-aa', 70],
    ['az-fu', 71],
    ['az-le', 72],
    ['az-qo', 73],
    ['az-sy', 74],
    ['az-nx', 75],
    ['az-mi', 76],
    ['az-ye', 77]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/az/az-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/az/az-all.js">Azerbaijan</a>'
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
