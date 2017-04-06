// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['lv-an', 0],
    ['lv-jj', 1],
    ['lv-vc', 2],
    ['lv-r', 3],
    ['lv-me', 4],
    ['lv-jp', 5],
    ['lv-jk', 6],
    ['lv-sc', 7],
    ['lv-ko', 8],
    ['lv-ak', 9],
    ['lv-sr', 10],
    ['lv-og', 11],
    ['lv-pl', 12],
    ['lv-vt', 13],
    ['lv-je', 14],
    ['lv-oz', 15],
    ['lv-rd', 16],
    ['lv-vl', 17],
    ['lv-ba', 18],
    ['lv-zi', 19],
    ['lv-dd', 20],
    ['lv-lv', 21],
    ['lv-rb', 22],
    ['lv-kt', 23],
    ['lv-se', 24],
    ['lv-ad', 25],
    ['lv-cr', 26],
    ['lv-ga', 27],
    ['lv-in', 28],
    ['lv-br', 29],
    ['lv-ju', 30],
    ['lv-kg', 31],
    ['lv-bd', 32],
    ['lv-kk', 33],
    ['lv-ol', 34],
    ['lv-bb', 35],
    ['lv-ml', 36],
    ['lv-rp', 37],
    ['lv-ss', 38],
    ['lv-ik', 39],
    ['lv-su', 40],
    ['lv-sp', 41],
    ['lv-am', 42],
    ['lv-vm', 43],
    ['lv-be', 44],
    ['lv-er', 45],
    ['lv-vr', 46],
    ['lv-km', 47],
    ['lv-lg', 48],
    ['lv-bt', 49],
    ['lv-na', 50],
    ['lv-ce', 51],
    ['lv-pg', 52],
    ['lv-pu', 53],
    ['lv-vb', 54],
    ['lv-sm', 55],
    ['lv-lu', 56],
    ['lv-ci', 57],
    ['lv-l', 58],
    ['lv-vg', 59],
    ['lv-bu', 60],
    ['lv-dg', 61],
    ['lv-lm', 62],
    ['lv-gu', 63],
    ['lv-ma', 64],
    ['lv-bl', 65],
    ['lv-ta', 66],
    ['lv-jg', 67],
    ['lv-tu', 68],
    ['lv-jm', 69],
    ['lv-mr', 70],
    ['lv-lj', 71],
    ['lv-vs', 72],
    ['lv-kn', 73],
    ['lv-kd', 74],
    ['lv-au', 75],
    ['lv-az', 76],
    ['lv-pk', 77],
    ['lv-rc', 78],
    ['lv-gr', 79],
    ['lv-ni', 80],
    ['lv-as', 81],
    ['lv-pt', 82],
    ['lv-vn', 83],
    ['lv-ne', 84],
    ['lv-ka', 85],
    ['lv-ag', 86],
    ['lv-il', 87],
    ['lv-aj', 88],
    ['lv-en', 89],
    ['lv-sl', 90],
    ['lv-ap', 91],
    ['lv-si', 92],
    ['lv-ru', 93],
    ['lv-rn', 94],
    ['lv-kr', 95],
    ['lv-vi', 96],
    ['lv-sa', 97],
    ['lv-al', 98],
    ['lv-st', 99],
    ['lv-rj', 100],
    ['lv-do', 101],
    ['lv-vd', 102],
    ['lv-dn', 103],
    ['lv-rr', 104],
    ['lv-ll', 105],
    ['lv-ie', 106],
    ['lv-te', 107],
    ['lv-vv', 108],
    ['lv-pr', 109],
    ['lv-cv', 110],
    ['lv-ja', 111],
    ['lv-lb', 112],
    ['lv-mz', 113],
    ['lv-dv', 114],
    ['lv-rk', 115],
    ['lv-vx', 116],
    ['lv-sk', 117],
    ['lv-dr', 118]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/lv/lv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lv/lv-all.js">Latvia</a>'
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
