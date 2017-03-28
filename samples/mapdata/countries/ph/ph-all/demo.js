// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ph-mn', 0],
    ['ph-4218', 1],
    ['ph-tt', 2],
    ['ph-bo', 3],
    ['ph-cb', 4],
    ['ph-bs', 5],
    ['ph-2603', 6],
    ['ph-su', 7],
    ['ph-aq', 8],
    ['ph-pl', 9],
    ['ph-ro', 10],
    ['ph-al', 11],
    ['ph-cs', 12],
    ['ph-6999', 13],
    ['ph-bn', 14],
    ['ph-cg', 15],
    ['ph-pn', 16],
    ['ph-bt', 17],
    ['ph-mc', 18],
    ['ph-qz', 19],
    ['ph-es', 20],
    ['ph-le', 21],
    ['ph-sm', 22],
    ['ph-ns', 23],
    ['ph-cm', 24],
    ['ph-di', 25],
    ['ph-ds', 26],
    ['ph-6457', 27],
    ['ph-6985', 28],
    ['ph-ii', 29],
    ['ph-7017', 30],
    ['ph-7021', 31],
    ['ph-lg', 32],
    ['ph-ri', 33],
    ['ph-ln', 34],
    ['ph-6991', 35],
    ['ph-ls', 36],
    ['ph-nc', 37],
    ['ph-mg', 38],
    ['ph-sk', 39],
    ['ph-sc', 40],
    ['ph-sg', 41],
    ['ph-an', 42],
    ['ph-ss', 43],
    ['ph-as', 44],
    ['ph-do', 45],
    ['ph-dv', 46],
    ['ph-bk', 47],
    ['ph-cl', 48],
    ['ph-6983', 49],
    ['ph-6984', 50],
    ['ph-6987', 51],
    ['ph-6986', 52],
    ['ph-6988', 53],
    ['ph-6989', 54],
    ['ph-6990', 55],
    ['ph-6992', 56],
    ['ph-6995', 57],
    ['ph-6996', 58],
    ['ph-6997', 59],
    ['ph-6998', 60],
    ['ph-nv', 61],
    ['ph-7020', 62],
    ['ph-7018', 63],
    ['ph-7022', 64],
    ['ph-1852', 65],
    ['ph-7000', 66],
    ['ph-7001', 67],
    ['ph-7002', 68],
    ['ph-7003', 69],
    ['ph-7004', 70],
    ['ph-7006', 71],
    ['ph-7007', 72],
    ['ph-7008', 73],
    ['ph-7009', 74],
    ['ph-7010', 75],
    ['ph-7011', 76],
    ['ph-7012', 77],
    ['ph-7013', 78],
    ['ph-7014', 79],
    ['ph-7015', 80],
    ['ph-7016', 81],
    ['ph-7019', 82],
    ['ph-6456', 83],
    ['ph-zs', 84],
    ['ph-nd', 85],
    ['ph-zn', 86],
    ['ph-md', 87],
    ['ph-ab', 88],
    ['ph-2658', 89],
    ['ph-ap', 90],
    ['ph-au', 91],
    ['ph-ib', 92],
    ['ph-if', 93],
    ['ph-mt', 94],
    ['ph-qr', 95],
    ['ph-ne', 96],
    ['ph-pm', 97],
    ['ph-ba', 98],
    ['ph-bg', 99],
    ['ph-zm', 100],
    ['ph-cv', 101],
    ['ph-bu', 102],
    ['ph-mr', 103],
    ['ph-sq', 104],
    ['ph-gu', 105],
    ['ph-ct', 106],
    ['ph-mb', 107],
    ['ph-mq', 108],
    ['ph-bi', 109],
    ['ph-sl', 110],
    ['ph-nr', 111],
    ['ph-ak', 112],
    ['ph-cp', 113],
    ['ph-cn', 114],
    ['ph-sr', 115],
    ['ph-in', 116],
    ['ph-is', 117],
    ['ph-tr', 118],
    ['ph-lu', 119]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ph/ph-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ph/ph-all.js">Philippines</a>'
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
