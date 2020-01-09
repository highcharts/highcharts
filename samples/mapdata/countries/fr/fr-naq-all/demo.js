// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-naq-cm', 0],
    ['fr-naq-lg', 1],
    ['fr-naq-cr', 2],
    ['fr-naq-ds', 3],
    ['fr-naq-hv', 4],
    ['fr-naq-dd', 5],
    ['fr-naq-ct', 6],
    ['fr-naq-gi', 7],
    ['fr-naq-ld', 8],
    ['fr-naq-vn', 9],
    ['fr-naq-cz', 10],
    ['fr-naq-pa', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-naq-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-naq-all.js">Nouvelle-Aquitaine</a>'
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
