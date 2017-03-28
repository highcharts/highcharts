// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-n-hp', 0],
    ['fr-n-ag', 1],
    ['fr-n-ta', 2],
    ['fr-n-tg', 3],
    ['fr-n-av', 4],
    ['fr-n-hg', 5],
    ['fr-n-ge', 6],
    ['fr-n-lo', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-n-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-n-all.js">Midi-Pyrénées</a>'
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
