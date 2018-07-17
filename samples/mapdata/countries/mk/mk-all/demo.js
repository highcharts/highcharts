// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mk-vv', 0],
    ['mk-ar', 1],
    ['mk-li', 2],
    ['mk-cz', 3],
    ['mk-dm', 4],
    ['mk-od', 5],
    ['mk-3086', 6],
    ['mk-pp', 7],
    ['mk-aj', 8],
    ['mk-st', 9],
    ['mk-pt', 10],
    ['mk-pe', 11],
    ['mk-su', 12],
    ['mk-sl', 13],
    ['mk-pn', 14],
    ['mk-vc', 15],
    ['mk-bu', 16],
    ['mk-ci', 17],
    ['mk-ng', 18],
    ['mk-rm', 19],
    ['mk-ce', 20],
    ['mk-zr', 21],
    ['mk-ch', 22],
    ['mk-cs', 23],
    ['mk-gb', 24],
    ['mk-gr', 25],
    ['mk-lo', 26],
    ['mk-dk', 27],
    ['mk-kn', 28],
    ['mk-kx', 29],
    ['mk-ca', 30],
    ['mk-av', 31],
    ['mk-ad', 32],
    ['mk-ss', 33],
    ['mk-vd', 34],
    ['mk-ky', 35],
    ['mk-tl', 36],
    ['mk-ks', 37],
    ['mk-um', 38],
    ['mk-ze', 39],
    ['mk-md', 40],
    ['mk-gp', 41],
    ['mk-kh', 42],
    ['mk-os', 43],
    ['mk-vh', 44],
    ['mk-vj', 45],
    ['mk-et', 46],
    ['mk-bn', 47],
    ['mk-gt', 48],
    ['mk-jg', 49],
    ['mk-ru', 50],
    ['mk-va', 51],
    ['mk-bg', 52],
    ['mk-ns', 53],
    ['mk-br', 54],
    ['mk-ni', 55],
    ['mk-rv', 56],
    ['mk-dr', 57],
    ['mk-ug', 58],
    ['mk-db', 59],
    ['mk-re', 60],
    ['mk-kz', 61],
    ['mk-kb', 62],
    ['mk-na', 63],
    ['mk-nv', 64],
    ['mk-mr', 65],
    ['mk-tr', 66],
    ['mk-gv', 67],
    ['mk-sd', 68],
    ['mk-dl', 69],
    ['mk-oc', 70],
    ['mk-mk', 71],
    ['mk-ph', 72],
    ['mk-rn', 73],
    ['mk-il', 74],
    ['mk-ve', 75],
    ['mk-zk', 76],
    ['mk-so', 77],
    ['mk-de', 78],
    ['mk-kg', 79],
    ['mk-mg', 80],
    ['mk-za', 81],
    ['mk-vl', 82],
    ['mk-bs', 83]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mk/mk-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mk/mk-all.js">Macedonia</a>'
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
