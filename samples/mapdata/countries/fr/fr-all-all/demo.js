// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-bre-mb', 0],
    ['fr-pdl-vd', 1],
    ['fr-occ-ad', 2],
    ['fr-pac-vc', 3],
    ['fr-ges-hm', 4],
    ['fr-ges-mr', 5],
    ['fr-hdf-no', 6],
    ['fr-occ-hp', 7],
    ['fr-cvl-in', 8],
    ['fr-naq-vn', 9],
    ['fr-naq-dd', 10],
    ['fr-naq-cm', 11],
    ['fr-pac-am', 12],
    ['fr-pac-vr', 13],
    ['fr-pac-ap', 14],
    ['fr-ara-ai', 15],
    ['fr-hdf-as', 16],
    ['fr-pac-bd', 17],
    ['fr-occ-av', 18],
    ['fr-occ-ga', 19],
    ['fr-ges-ab', 20],
    ['fr-bfc-co', 21],
    ['fr-bfc-sl', 22],
    ['fr-cvl-ch', 23],
    ['fr-naq-cr', 24],
    ['fr-pdl-ml', 25],
    ['fr-naq-ds', 26],
    ['fr-naq-ct', 27],
    ['fr-ara-dm', 28],
    ['fr-ara-ah', 29],
    ['fr-nor-eu', 30],
    ['fr-idf-es', 31],
    ['fr-cvl-el', 32],
    ['fr-occ-hg', 33],
    ['fr-idf-hd', 34],
    ['fr-naq-hv', 35],
    ['fr-pdl-st', 36],
    ['fr-cvl-il', 37],
    ['fr-ara-is', 38],
    ['fr-bfc-ju', 39],
    ['fr-bfc-hn', 40],
    ['fr-ara-lr', 41],
    ['fr-occ-tg', 42],
    ['fr-occ-lo', 43],
    ['fr-naq-lg', 44],
    ['fr-occ-lz', 45],
    ['fr-bre-iv', 46],
    ['fr-ges-mm', 47],
    ['fr-ges-ms', 48],
    ['fr-bfc-ni', 49],
    ['fr-naq-cz', 50],
    ['fr-ara-pd', 51],
    ['fr-occ-ge', 52],
    ['fr-naq-pa', 53],
    ['fr-ara-sv', 54],
    ['fr-idf-se', 55],
    ['fr-idf-vp', 56],
    ['fr-idf-ss', 57],
    ['fr-idf-vm', 58],
    ['fr-hdf-so', 59],
    ['fr-bfc-tb', 60],
    ['fr-bfc-db', 61],
    ['fr-idf-vo', 62],
    ['fr-ges-vg', 63],
    ['fr-idf-yv', 64],
    ['fr-cvl-lc', 65],
    ['fr-cor-cs', 66],
    ['fr-bre-fi', 67],
    ['fr-cor-hc', 68],
    ['fr-nor-mh', 69],
    ['fr-ges-an', 70],
    ['fr-occ-ag', 71],
    ['fr-ges-br', 72],
    ['fr-nor-cv', 73],
    ['fr-ara-cl', 74],
    ['fr-bre-ca', 75],
    ['fr-naq-gi', 76],
    ['fr-ges-hr', 77],
    ['fr-ara-hs', 78],
    ['fr-occ-he', 79],
    ['fr-naq-ld', 80],
    ['fr-pdl-la', 81],
    ['fr-ges-mo', 82],
    ['fr-nor-or', 83],
    ['fr-hdf-pc', 84],
    ['fr-occ-po', 85],
    ['fr-pdl-my', 86],
    ['fr-nor-sm', 87],
    ['fr-bfc-yo', 88],
    ['fr-ara-al', 89],
    ['fr-ara-hl', 90],
    ['fr-pac-ha', 91],
    ['fr-cvl-lt', 92],
    ['fr-hdf-oi', 93],
    ['fr-ara-rh', 94],
    ['fr-occ-ta', 95],
    ['undefined', 96],
    ['fr-lre-re', 97],
    ['fr-may-yt', 98],
    ['fr-gf-gf', 99],
    ['fr-mq-mq', 100],
    ['fr-gua-gp', 101],
    ['undefined', 102]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-all-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-all-all.js">France, admin2</a>'
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
    }, {
        name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/fr/fr-all-all'], 'mapline'),
        color: 'silver',
        nullColor: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
