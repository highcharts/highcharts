// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cg-ni', 0],
    ['cg-pl', 1],
    ['cg-br', 2],
    ['cg-7280', 3],
    ['cg-bo', 4],
    ['cg-li', 5],
    ['cg-sa', 6],
    ['cg-cu', 7],
    ['cg-po', 8],
    ['cg-co', 9],
    ['cg-ko', 10],
    ['cg-le', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cg/cg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cg/cg-all.js">Republic of the Congo</a>'
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
