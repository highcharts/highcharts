// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-ze-gm0716', 0],
    ['nl-ze-gm0717', 1],
    ['nl-ze-gm1714', 2],
    ['nl-ze-gm1676', 3],
    ['nl-ze-gm0678', 4],
    ['nl-ze-gm0703', 5],
    ['nl-ze-gm0664', 6],
    ['nl-ze-gm0687', 7],
    ['nl-ze-gm1695', 8],
    ['nl-ze-gm0718', 9],
    ['nl-ze-gm0654', 10],
    ['nl-ze-gm0715', 11],
    ['nl-ze-gm0677', 12]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-ze-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-ze-all.js">Zeeland</a>'
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
