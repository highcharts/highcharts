// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-bre-mb', 0],
    ['fr-pac-am', 1],
    ['fr-pac-vr', 2],
    ['fr-pdl-vd', 3],
    ['fr-ara-ai', 4],
    ['fr-occ-ad', 5],
    ['fr-pac-vc', 6],
    ['fr-occ-hg', 7],
    ['fr-ara-cl', 8],
    ['fr-occ-lz', 9],
    ['fr-ges-mm', 10],
    ['fr-hdf-no', 11],
    ['fr-occ-hp', 12],
    ['fr-naq-dd', 13],
    ['fr-naq-cm', 14],
    ['fr-pac-ap', 15],
    ['fr-hdf-as', 16],
    ['fr-occ-av', 17],
    ['fr-occ-ga', 18],
    ['fr-ges-ab', 19],
    ['fr-bfc-co', 20],
    ['fr-bfc-sl', 21],
    ['fr-cvl-ch', 22],
    ['fr-naq-cr', 23],
    ['fr-pdl-ml', 24],
    ['fr-naq-ds', 25],
    ['fr-naq-ct', 26],
    ['fr-ara-dm', 27],
    ['fr-ara-ah', 28],
    ['fr-nor-eu', 29],
    ['fr-idf-es', 30],
    ['fr-cvl-el', 31],
    ['fr-ara-hs', 32],
    ['fr-idf-hd', 33],
    ['fr-pdl-st', 34],
    ['fr-cvl-il', 35],
    ['fr-ara-is', 36],
    ['fr-bfc-ju', 37],
    ['fr-ara-lr', 38],
    ['fr-occ-lo', 39],
    ['fr-occ-tg', 40],
    ['fr-naq-lg', 41],
    ['fr-bre-iv', 42],
    ['fr-ges-ms', 43],
    ['fr-bfc-ni', 44],
    ['fr-cvl-lt', 45],
    ['fr-idf-vp', 46],
    ['fr-naq-cz', 47],
    ['fr-ara-pd', 48],
    ['fr-occ-ge', 49],
    ['fr-naq-pa', 50],
    ['fr-idf-se', 51],
    ['fr-idf-ss', 52],
    ['fr-hdf-so', 53],
    ['fr-bfc-tb', 54],
    ['fr-bfc-hn', 55],
    ['fr-idf-vo', 56],
    ['fr-idf-vm', 57],
    ['fr-naq-vn', 58],
    ['fr-ges-vg', 59],
    ['fr-idf-yv', 60],
    ['fr-pac-bd', 61],
    ['fr-cvl-lc', 62],
    ['fr-bre-fi', 63],
    ['fr-nor-mh', 64],
    ['fr-ges-an', 65],
    ['fr-occ-ag', 66],
    ['fr-ges-br', 67],
    ['fr-nor-cv', 68],
    ['fr-bre-ca', 69],
    ['fr-bfc-db', 70],
    ['fr-naq-gi', 71],
    ['fr-ges-hr', 72],
    ['fr-ara-hl', 73],
    ['fr-ges-hm', 74],
    ['fr-pac-ha', 75],
    ['fr-occ-he', 76],
    ['fr-naq-ld', 77],
    ['fr-pdl-la', 78],
    ['fr-ges-mr', 79],
    ['fr-pdl-my', 80],
    ['fr-ges-mo', 81],
    ['fr-nor-or', 82],
    ['fr-hdf-pc', 83],
    ['fr-occ-po', 84],
    ['fr-ara-al', 85],
    ['fr-ara-sv', 86],
    ['fr-nor-sm', 87],
    ['fr-naq-hv', 88],
    ['fr-cvl-in', 89],
    ['fr-hdf-oi', 90],
    ['fr-ara-rh', 91],
    ['fr-occ-ta', 92],
    ['fr-bfc-yo', 93],
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
