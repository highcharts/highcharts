// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-dr-gm1680', 0],
    ['nl-dr-gm1699', 1],
    ['nl-dr-gm0106', 2],
    ['nl-dr-gm0118', 3],
    ['nl-dr-gm0109', 4],
    ['nl-dr-gm1701', 5],
    ['nl-dr-gm1731', 6],
    ['nl-dr-gm1681', 7],
    ['nl-dr-gm1690', 8],
    ['nl-dr-gm0114', 9],
    ['nl-dr-gm0119', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-dr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-dr-all.js">Drenthe</a>'
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
