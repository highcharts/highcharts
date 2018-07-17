// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-e-mb', 0],
    ['fr-u-am', 1],
    ['fr-u-vr', 2],
    ['fr-r-vd', 3],
    ['fr-v-ai', 4],
    ['fr-k-ad', 5],
    ['fr-u-vc', 6],
    ['fr-n-hg', 7],
    ['fr-c-cl', 8],
    ['fr-k-lz', 9],
    ['fr-m-mm', 10],
    ['fr-o-no', 11],
    ['fr-n-hp', 12],
    ['fr-b-dd', 13],
    ['fr-t-cm', 14],
    ['fr-u-ap', 15],
    ['fr-s-as', 16],
    ['fr-n-av', 17],
    ['fr-k-ga', 18],
    ['fr-g-ab', 19],
    ['fr-d-co', 20],
    ['fr-d-sl', 21],
    ['fr-f-ch', 22],
    ['fr-l-cr', 23],
    ['fr-r-ml', 24],
    ['fr-t-ds', 25],
    ['fr-t-ct', 26],
    ['fr-v-dm', 27],
    ['fr-v-ah', 28],
    ['fr-q-eu', 29],
    ['fr-j-es', 30],
    ['fr-f-el', 31],
    ['fr-v-hs', 32],
    ['fr-j-hd', 33],
    ['fr-r-st', 34],
    ['fr-f-il', 35],
    ['fr-v-is', 36],
    ['fr-i-ju', 37],
    ['fr-v-lr', 38],
    ['fr-n-lo', 39],
    ['fr-n-tg', 40],
    ['fr-b-lg', 41],
    ['fr-e-iv', 42],
    ['fr-m-ms', 43],
    ['fr-d-ni', 44],
    ['fr-f-lt', 45],
    ['fr-j-vp', 46],
    ['fr-l-cz', 47],
    ['fr-c-pd', 48],
    ['fr-n-ge', 49],
    ['fr-b-pa', 50],
    ['fr-j-se', 51],
    ['fr-j-ss', 52],
    ['fr-s-so', 53],
    ['fr-i-tb', 54],
    ['fr-i-hn', 55],
    ['fr-j-vo', 56],
    ['fr-j-vm', 57],
    ['fr-t-vn', 58],
    ['fr-m-vg', 59],
    ['fr-j-yv', 60],
    ['fr-u-bd', 61],
    ['fr-f-lc', 62],
    ['fr-e-fi', 63],
    ['fr-p-mh', 64],
    ['fr-g-an', 65],
    ['fr-n-ag', 66],
    ['fr-a-br', 67],
    ['fr-p-cv', 68],
    ['fr-e-ca', 69],
    ['fr-i-db', 70],
    ['fr-b-gi', 71],
    ['fr-a-hr', 72],
    ['fr-c-hl', 73],
    ['fr-g-hm', 74],
    ['fr-u-ha', 75],
    ['fr-k-he', 76],
    ['fr-b-ld', 77],
    ['fr-r-la', 78],
    ['fr-g-mr', 79],
    ['fr-r-my', 80],
    ['fr-m-mo', 81],
    ['fr-p-or', 82],
    ['fr-o-pc', 83],
    ['fr-k-po', 84],
    ['fr-c-al', 85],
    ['fr-v-sv', 86],
    ['fr-q-sm', 87],
    ['fr-l-hv', 88],
    ['fr-f-in', 89],
    ['fr-s-oi', 90],
    ['fr-v-rh', 91],
    ['fr-n-ta', 92],
    ['fr-d-yo', 93],
    ['undefined', 94]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/custom/fr-all-all-mainland'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-all-mainland.js">France, mainland admin2</a>'
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
