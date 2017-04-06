// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-3559-gm0351', 0],
    ['nl-3559-gm0632', 1],
    ['nl-3559-gm1904', 2],
    ['nl-3559-gm0352', 3],
    ['nl-3559-gm0355', 4],
    ['nl-3559-gm0345', 5],
    ['nl-3559-gm1581', 6],
    ['nl-3559-gm0307', 7],
    ['nl-3559-gm0313', 8],
    ['nl-3559-gm0308', 9],
    ['nl-3559-gm0356', 10],
    ['nl-3559-gm0317', 11],
    ['nl-3559-gm0736', 12],
    ['nl-3559-gm0327', 13],
    ['nl-3559-gm0342', 14],
    ['nl-3559-gm0339', 15],
    ['nl-3559-gm0340', 16],
    ['nl-3559-gm0331', 17],
    ['nl-3559-gm0589', 18],
    ['nl-3559-gm0312', 19],
    ['nl-3559-gm0321', 20],
    ['nl-3559-gm0310', 21],
    ['nl-3559-gm0344', 22],
    ['nl-3559-gm0335', 23],
    ['nl-3559-gm0353', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-ut-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ut-all.js">Utrecht</a>'
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
