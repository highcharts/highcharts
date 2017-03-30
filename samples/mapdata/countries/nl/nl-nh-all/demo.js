// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-3557-gm0381', 0],
    ['nl-3557-gm0377', 1],
    ['nl-3557-gm0363', 2],
    ['nl-3557-gm0376', 3],
    ['nl-3557-gm0420', 4],
    ['nl-3557-gm0424', 5],
    ['nl-3557-gm0448', 6],
    ['nl-3557-gm0453', 7],
    ['nl-3557-gm0383', 8],
    ['nl-3557-gm1911', 9],
    ['nl-3557-gm0398', 10],
    ['nl-3557-gm0479', 11],
    ['nl-3557-gm0362', 12],
    ['nl-3557-gm0393', 13],
    ['nl-3557-gm0498', 14],
    ['nl-3557-gm0405', 15],
    ['nl-3557-gm0388', 16],
    ['nl-3557-gm0425', 17],
    ['nl-3557-gm0402', 18],
    ['nl-3557-gm0457', 19],
    ['nl-3557-gm0406', 20],
    ['nl-3557-gm0392', 21],
    ['nl-3557-gm0394', 22],
    ['nl-3557-gm0375', 23],
    ['nl-3557-gm0437', 24],
    ['nl-3557-gm1598', 25],
    ['nl-3557-gm0417', 26],
    ['nl-3557-gm0432', 27],
    ['nl-3557-gm0358', 28],
    ['nl-3557-gm0365', 29],
    ['nl-3557-gm0370', 30],
    ['nl-3557-gm0361', 31],
    ['nl-3557-gm0373', 32],
    ['nl-3557-gm0416', 33],
    ['nl-3557-gm0415', 34],
    ['nl-3557-gm0439', 35],
    ['nl-3557-gm0441', 36],
    ['nl-3557-gm0396', 37],
    ['nl-3557-gm0852', 38],
    ['nl-3557-gm0451', 39],
    ['nl-3557-gm0880', 40],
    ['nl-3557-gm0431', 41],
    ['nl-3557-gm0384', 42],
    ['nl-3557-gm0532', 43],
    ['nl-3557-gm1696', 44],
    ['nl-3557-gm0400', 45],
    ['nl-3557-gm0399', 46],
    ['nl-3557-gm0385', 47],
    ['nl-3557-gm0478', 48],
    ['nl-3557-gm0473', 49],
    ['nl-3557-gm0397', 50],
    ['nl-3557-gm0458', 51],
    ['nl-3557-gm0450', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-nh-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-nh-all.js">Noord-Holland</a>'
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
