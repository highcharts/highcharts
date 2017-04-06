// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-3560-gm0627', 0],
    ['nl-3560-gm1672', 1],
    ['nl-3560-gm1924', 2],
    ['nl-3560-gm0537', 3],
    ['nl-3560-gm1525', 4],
    ['nl-3560-gm0576', 5],
    ['nl-3560-gm0617', 6],
    ['nl-3560-gm1901', 7],
    ['nl-3560-gm0623', 8],
    ['nl-3560-gm0545', 9],
    ['nl-3560-gm0620', 10],
    ['nl-3560-gm1621', 11],
    ['nl-3560-gm0637', 12],
    ['nl-3560-gm0499', 13],
    ['nl-3560-gm0512', 14],
    ['nl-3560-gm0523', 15],
    ['nl-3560-gm0531', 16],
    ['nl-3560-gm0482', 17],
    ['nl-3560-gm0546', 18],
    ['nl-3560-gm0534', 19],
    ['nl-3560-gm0553', 20],
    ['nl-3560-gm0585', 21],
    ['nl-3560-gm0638', 22],
    ['nl-3560-gm1916', 23],
    ['nl-3560-gm0568', 24],
    ['nl-3560-gm0612', 25],
    ['nl-3560-gm0505', 26],
    ['nl-3560-gm0590', 27],
    ['nl-3560-gm0503', 28],
    ['nl-3560-gm0599', 29],
    ['nl-3560-gm1926', 30],
    ['nl-3560-gm1892', 31],
    ['nl-3560-gm0644', 32],
    ['nl-3560-gm0491', 33],
    ['nl-3560-gm0608', 34],
    ['nl-3560-gm0610', 35],
    ['nl-3560-gm0530', 36],
    ['nl-3560-gm0614', 37],
    ['nl-3560-gm0584', 38],
    ['nl-3560-gm0611', 39],
    ['nl-3560-gm0588', 40],
    ['nl-3560-gm0501', 41],
    ['nl-3560-gm0613', 42],
    ['nl-3560-gm0622', 43],
    ['nl-3560-gm0556', 44],
    ['nl-3560-gm0629', 45],
    ['nl-3560-gm0547', 46],
    ['nl-3560-gm0642', 47],
    ['nl-3560-gm0489', 48],
    ['nl-3560-gm1927', 49],
    ['nl-3560-gm0597', 50],
    ['nl-3560-gm0542', 51],
    ['nl-3560-gm0502', 52],
    ['nl-3560-gm0513', 53],
    ['nl-3560-gm0518', 54],
    ['nl-3560-gm1783', 55],
    ['nl-3560-gm1842', 56],
    ['nl-3560-gm0575', 57],
    ['nl-3560-gm0603', 58],
    ['nl-3560-gm0569', 59],
    ['nl-3560-gm1884', 60],
    ['nl-3560-gm0484', 61],
    ['nl-3560-gm0626', 62],
    ['nl-3560-gm0643', 63],
    ['nl-3560-gm0689', 64],
    ['nl-3560-gm0707', 65],
    ['nl-3560-gm0579', 66],
    ['nl-3560-gm0606', 67]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-zh-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-zh-all.js">Zuid-Holland</a>'
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
