// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tr-or', 0],
    ['tr-ss', 1],
    ['tr-ga', 2],
    ['tr-4409', 3],
    ['tr-kc', 4],
    ['tr-bk', 5],
    ['tr-ck', 6],
    ['tr-tt', 7],
    ['tr-gi', 8],
    ['tr-en', 9],
    ['tr-bg', 10],
    ['tr-ht', 11],
    ['tr-aa', 12],
    ['tr-cm', 13],
    ['tr-kk', 14],
    ['tr-ng', 15],
    ['tr-ak', 16],
    ['tr-kh', 17],
    ['tr-yz', 18],
    ['tr-am', 19],
    ['tr-ms', 20],
    ['tr-bm', 21],
    ['tr-ka', 22],
    ['tr-ig', 23],
    ['tr-du', 24],
    ['tr-zo', 25],
    ['tr-kb', 26],
    ['tr-yl', 27],
    ['tr-sk', 28],
    ['tr-ci', 29],
    ['tr-bl', 30],
    ['tr-ed', 31],
    ['tr-es', 32],
    ['tr-ko', 33],
    ['tr-bu', 34],
    ['tr-kl', 35],
    ['tr-ib', 36],
    ['tr-kr', 37],
    ['tr-al', 38],
    ['tr-af', 39],
    ['tr-bd', 40],
    ['tr-ip', 41],
    ['tr-ay', 42],
    ['tr-mn', 43],
    ['tr-dy', 44],
    ['tr-ad', 45],
    ['tr-km', 46],
    ['tr-ky', 47],
    ['tr-eg', 48],
    ['tr-ic', 49],
    ['tr-sp', 50],
    ['tr-av', 51],
    ['tr-ri', 52],
    ['tr-tb', 53],
    ['tr-an', 54],
    ['tr-su', 55],
    ['tr-bb', 56],
    ['tr-em', 57],
    ['tr-mr', 58],
    ['tr-sr', 59],
    ['tr-si', 60],
    ['tr-hk', 61],
    ['tr-va', 62],
    ['tr-ar', 63],
    ['tr-ki', 64],
    ['tr-br', 65],
    ['tr-tg', 66],
    ['tr-iz', 67],
    ['tr-ks', 68],
    ['tr-mg', 69],
    ['tr-ku', 70],
    ['tr-nv', 71],
    ['tr-sv', 72],
    ['tr-tc', 73],
    ['tr-ml', 74],
    ['tr-ag', 75],
    ['tr-bt', 76],
    ['tr-gu', 77],
    ['tr-os', 78],
    ['tr-bc', 79],
    ['tr-dn', 80],
    ['tr-us', 81]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tr/tr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tr/tr-all.js">Turkey</a>'
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
