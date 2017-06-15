// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['vn-yb', 0],
    ['vn-pt', 1],
    ['vn-3655', 2],
    ['vn-qn', 3],
    ['vn-kh', 4],
    ['vn-tg', 5],
    ['vn-bv', 6],
    ['vn-bu', 7],
    ['vn-hc', 8],
    ['vn-br', 9],
    ['vn-st', 10],
    ['vn-li', 11],
    ['vn-311', 12],
    ['vn-ty', 13],
    ['vn-318', 14],
    ['vn-hd', 15],
    ['vn-bn', 16],
    ['vn-317', 17],
    ['vn-vc', 18],
    ['vn-nb', 19],
    ['vn-hm', 20],
    ['vn-ho', 21],
    ['vn-bg', 22],
    ['vn-tb', 23],
    ['vn-ld', 24],
    ['vn-bp', 25],
    ['vn-tn', 26],
    ['vn-py', 27],
    ['vn-bd', 28],
    ['vn-3623', 29],
    ['vn-724', 30],
    ['vn-qg', 31],
    ['vn-331', 32],
    ['vn-dt', 33],
    ['vn-333', 34],
    ['vn-la', 35],
    ['vn-337', 36],
    ['vn-bl', 37],
    ['vn-vl', 38],
    ['vn-hg', 39],
    ['vn-nd', 40],
    ['vn-db', 41],
    ['vn-ls', 42],
    ['vn-th', 43],
    ['vn-307', 44],
    ['vn-tq', 45],
    ['vn-328', 46],
    ['vn-na', 47],
    ['vn-qb', 48],
    ['vn-723', 49],
    ['vn-nt', 50],
    ['vn-6365', 51],
    ['vn-299', 52],
    ['vn-300', 53],
    ['vn-qt', 54],
    ['vn-tt', 55],
    ['vn-kg', 56],
    ['vn-da', 57],
    ['vn-ag', 58],
    ['vn-cm', 59],
    ['vn-tv', 60],
    ['vn-cb', 61],
    ['vn-lo', 62],
    ['vn-bi', 63]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/vn/vn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/vn/vn-all.js">Vietnam</a>'
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
