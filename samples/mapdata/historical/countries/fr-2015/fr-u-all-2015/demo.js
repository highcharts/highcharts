// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-u-am', 0],
    ['fr-u-vr', 1],
    ['fr-u-vc', 2],
    ['fr-u-ap', 3],
    ['fr-u-ha', 4],
    ['fr-u-bd', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'historical/countries/fr-2015/fr-u-all-2015'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-u-all-2015.js">Provence-Alpes-Côte-d\'Azur (2015)</a>'
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
