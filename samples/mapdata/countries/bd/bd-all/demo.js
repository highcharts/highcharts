// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bd-da', 0],
    ['bd-kh', 1],
    ['bd-ba', 2],
    ['bd-cg', 3],
    ['bd-sy', 4],
    ['bd-rj', 5],
    ['bd-rp', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bd/bd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bd/bd-all.js">Bangladesh</a>'
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
