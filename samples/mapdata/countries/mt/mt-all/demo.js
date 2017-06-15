// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mt-7358', 0],
    ['mt-7363', 1],
    ['mt-7369', 2],
    ['mt-7346', 3],
    ['mt-7370', 4],
    ['mt-7374', 5],
    ['mt-7376', 6],
    ['mt-7373', 7],
    ['mt-7378', 8],
    ['mt-7380', 9],
    ['mt-7382', 10],
    ['mt-7384', 11],
    ['mt-7385', 12],
    ['mt-7386', 13],
    ['mt-7396', 14],
    ['mt-7393', 15],
    ['mt-7332', 16],
    ['mt-7353', 17],
    ['mt-3630', 18],
    ['mt-7344', 19],
    ['mt-7345', 20],
    ['mt-7347', 21],
    ['mt-7350', 22],
    ['mt-7352', 23],
    ['mt-7354', 24],
    ['mt-7355', 25],
    ['mt-7351', 26],
    ['mt-7356', 27],
    ['mt-7360', 28],
    ['mt-7361', 29],
    ['mt-7364', 30],
    ['mt-7365', 31],
    ['mt-7366', 32],
    ['mt-7367', 33],
    ['mt-7368', 34],
    ['mt-7372', 35],
    ['mt-7359', 36],
    ['mt-7375', 37],
    ['mt-7377', 38],
    ['mt-7379', 39],
    ['mt-7381', 40],
    ['mt-7383', 41],
    ['mt-7388', 42],
    ['mt-7389', 43],
    ['mt-7390', 44],
    ['mt-7387', 45],
    ['mt-7391', 46],
    ['mt-7394', 47],
    ['mt-7395', 48],
    ['mt-7397', 49],
    ['mt-7343', 50],
    ['mt-7336', 51],
    ['mt-7337', 52],
    ['mt-7331', 53],
    ['mt-7339', 54],
    ['mt-7340', 55],
    ['mt-7342', 56],
    ['mt-7341', 57],
    ['mt-7348', 58],
    ['mt-7349', 59],
    ['mt-7357', 60],
    ['mt-7371', 61],
    ['mt-7392', 62],
    ['mt-7330', 63],
    ['mt-7333', 64],
    ['mt-7335', 65],
    ['mt-7338', 66],
    ['mt-7334', 67]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mt/mt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mt/mt-all.js">Malta</a>'
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
