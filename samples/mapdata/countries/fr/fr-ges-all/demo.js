// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-ges-an', 0],
    ['fr-ges-mr', 1],
    ['fr-ges-mm', 2],
    ['fr-ges-br', 3],
    ['fr-ges-ms', 4],
    ['fr-ges-mo', 5],
    ['fr-ges-hr', 6],
    ['fr-ges-vg', 7],
    ['fr-ges-ab', 8],
    ['fr-ges-hm', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-ges-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-ges-all.js">Grand Est</a>'
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
