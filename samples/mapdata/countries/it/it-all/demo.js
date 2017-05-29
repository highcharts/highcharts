// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['it-na', 0],
    ['it-tp', 1],
    ['it-pa', 2],
    ['it-me', 3],
    ['it-ag', 4],
    ['it-nu', 5],
    ['it-og', 6],
    ['it-ms', 7],
    ['it-mt', 8],
    ['it-bn', 9],
    ['it-cl', 10],
    ['it-an', 11],
    ['it-pg', 12],
    ['it-ci', 13],
    ['it-ss', 14],
    ['it-ot', 15],
    ['it-gr', 16],
    ['it-li', 17],
    ['it-ar', 18],
    ['it-fe', 19],
    ['it-ra', 20],
    ['it-fi', 21],
    ['it-fc', 22],
    ['it-rn', 23],
    ['it-ge', 24],
    ['it-sv', 25],
    ['it-vs', 26],
    ['it-ve', 27],
    ['it-ca', 28],
    ['it-pi', 29],
    ['it-re', 30],
    ['it-lu', 31],
    ['it-bo', 32],
    ['it-pt', 33],
    ['it-pz', 34],
    ['it-cz', 35],
    ['it-rc', 36],
    ['it-ce', 37],
    ['it-lt', 38],
    ['it-av', 39],
    ['it-is', 40],
    ['it-ba', 41],
    ['it-br', 42],
    ['it-le', 43],
    ['it-ta', 44],
    ['it-ct', 45],
    ['it-rg', 46],
    ['it-pe', 47],
    ['it-ri', 48],
    ['it-te', 49],
    ['it-fr', 50],
    ['it-aq', 51],
    ['it-rm', 52],
    ['it-ch', 53],
    ['it-vt', 54],
    ['it-pu', 55],
    ['it-mc', 56],
    ['it-fm', 57],
    ['it-ap', 58],
    ['it-si', 59],
    ['it-tr', 60],
    ['it-to', 61],
    ['it-bi', 62],
    ['it-no', 63],
    ['it-vc', 64],
    ['it-ao', 65],
    ['it-vb', 66],
    ['it-al', 67],
    ['it-mn', 68],
    ['it-pc', 69],
    ['it-lo', 70],
    ['it-pv', 71],
    ['it-cr', 72],
    ['it-mi', 73],
    ['it-va', 74],
    ['it-so', 75],
    ['it-co', 76],
    ['it-lc', 77],
    ['it-bg', 78],
    ['it-mb', 79],
    ['it-ud', 80],
    ['it-go', 81],
    ['it-ts', 82],
    ['it-ro', 83],
    ['it-pd', 84],
    ['it-vr', 85],
    ['it-tn', 86],
    ['it-bl', 87],
    ['it-mo', 88],
    ['it-sp', 89],
    ['it-pr', 90],
    ['it-fg', 91],
    ['it-im', 92],
    ['it-or', 93],
    ['it-cs', 94],
    ['it-vv', 95],
    ['it-sa', 96],
    ['it-bt', 97],
    ['it-sr', 98],
    ['it-en', 99],
    ['it-cn', 100],
    ['it-bz', 101],
    ['it-po', 102],
    ['it-kr', 103],
    ['it-cb', 104],
    ['it-at', 105],
    ['it-bs', 106],
    ['it-pn', 107],
    ['it-vi', 108],
    ['it-tv', 109]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/it/it-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/it/it-all.js">Italy</a>'
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
