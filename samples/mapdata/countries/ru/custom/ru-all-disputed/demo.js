// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ru-sc', 0],
    ['ru-kr', 1],
    ['ru-2485', 2],
    ['ru-ar', 3],
    ['ru-nn', 4],
    ['ru-yn', 5],
    ['ru-ky', 6],
    ['ru-ck', 7],
    ['ru-kh', 8],
    ['ru-sl', 9],
    ['ru-ka', 10],
    ['ru-kt', 11],
    ['ru-ms', 12],
    ['ru-rz', 13],
    ['ru-sa', 14],
    ['ru-ul', 15],
    ['ru-om', 16],
    ['ru-ns', 17],
    ['ru-mm', 18],
    ['ru-ln', 19],
    ['ru-sp', 20],
    ['ru-ki', 21],
    ['ru-kc', 22],
    ['ru-in', 23],
    ['ru-kb', 24],
    ['ru-no', 25],
    ['ru-st', 26],
    ['ru-sm', 27],
    ['ru-ps', 28],
    ['ru-tv', 29],
    ['ru-vo', 30],
    ['ru-iv', 31],
    ['ru-ys', 32],
    ['ru-kg', 33],
    ['ru-br', 34],
    ['ru-ks', 35],
    ['ru-lp', 36],
    ['ru-2509', 37],
    ['ru-ol', 38],
    ['ru-nz', 39],
    ['ru-pz', 40],
    ['ru-vl', 41],
    ['ru-vr', 42],
    ['ru-ko', 43],
    ['ru-sv', 44],
    ['ru-bk', 45],
    ['ru-ud', 46],
    ['ru-mr', 47],
    ['ru-cv', 48],
    ['ru-cl', 49],
    ['ru-ob', 50],
    ['ru-sr', 51],
    ['ru-tt', 52],
    ['ru-to', 53],
    ['ru-ty', 54],
    ['ru-ga', 55],
    ['ru-kk', 56],
    ['ru-cn', 57],
    ['ru-kl', 58],
    ['ru-da', 59],
    ['ru-ro', 60],
    ['ru-bl', 61],
    ['ru-tu', 62],
    ['ru-ir', 63],
    ['ru-ct', 64],
    ['ru-yv', 65],
    ['ru-am', 66],
    ['ru-tb', 67],
    ['ru-tl', 68],
    ['ru-ng', 69],
    ['ru-vg', 70],
    ['ru-kv', 71],
    ['ru-me', 72],
    ['ru-ke', 73],
    ['ru-as', 74],
    ['ru-pr', 75],
    ['ru-mg', 76],
    ['ru-bu', 77],
    ['ru-kn', 78],
    ['ru-kd', 79],
    ['ru-ku', 80],
    ['ru-al', 81],
    ['ru-km', 82],
    ['ru-pe', 83],
    ['ru-ad', 84]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ru/custom/ru-all-disputed'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ru/custom/ru-all-disputed.js">Russia with disputed territories</a>'
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
