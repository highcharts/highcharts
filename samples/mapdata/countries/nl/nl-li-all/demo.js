// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-li-gm0889', 0],
    ['nl-li-gm0899', 1],
    ['nl-li-gm0882', 2],
    ['nl-li-gm0917', 3],
    ['nl-li-gm0951', 4],
    ['nl-li-gm0971', 5],
    ['nl-li-gm0888', 6],
    ['nl-li-gm0881', 7],
    ['nl-li-gm1883', 8],
    ['nl-li-gm0928', 9],
    ['nl-li-gm0944', 10],
    ['nl-li-gm1711', 11],
    ['nl-li-gm0946', 12],
    ['nl-li-gm0938', 13],
    ['nl-li-gm1641', 14],
    ['nl-li-gm0957', 15],
    ['nl-li-gm1669', 16],
    ['nl-li-gm0962', 17],
    ['nl-li-gm0965', 18],
    ['nl-li-gm0935', 19],
    ['nl-li-gm1729', 20],
    ['nl-li-gm1507', 21],
    ['nl-li-gm0994', 22],
    ['nl-li-gm0893', 23],
    ['nl-li-gm0986', 24],
    ['nl-li-gm0983', 25],
    ['nl-li-gm1640', 26],
    ['nl-li-gm0984', 27],
    ['nl-li-gm1894', 28],
    ['nl-li-gm0981', 29],
    ['nl-li-gm0988', 30],
    ['nl-li-gm1903', 31],
    ['nl-li-gm0907', 32]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-li-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-li-all.js">Limburg</a>'
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
