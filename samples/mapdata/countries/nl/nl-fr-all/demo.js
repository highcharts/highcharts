// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-fr-gm0058', 0],
    ['nl-fr-gm0060', 1],
    ['nl-fr-gm0093', 2],
    ['nl-fr-gm0063', 3],
    ['nl-fr-gm0079', 4],
    ['nl-fr-gm1891', 5],
    ['nl-fr-gm0072', 6],
    ['nl-fr-gm1722', 7],
    ['nl-fr-gm0088', 8],
    ['nl-fr-gm0096', 9],
    ['nl-fr-gm1900', 10],
    ['nl-fr-gm0140', 11],
    ['nl-fr-gm0070', 12],
    ['nl-fr-gm0055', 13],
    ['nl-fr-gm0051', 14],
    ['nl-fr-gm0653', 15],
    ['nl-fr-gm1908', 16],
    ['nl-fr-gm0081', 17],
    ['nl-fr-gm0737', 18],
    ['nl-fr-gm0090', 19],
    ['nl-fr-gm0082', 20],
    ['nl-fr-gm0098', 21],
    ['nl-fr-gm0080', 22],
    ['nl-fr-gm0085', 23],
    ['nl-fr-gm0059', 24],
    ['nl-fr-gm0086', 25],
    ['nl-fr-gm0074', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-fr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-fr-all.js">Friesland</a>'
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
