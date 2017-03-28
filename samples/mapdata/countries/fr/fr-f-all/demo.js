// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-f-in', 0],
    ['fr-f-il', 1],
    ['fr-f-el', 2],
    ['fr-f-lc', 3],
    ['fr-f-ch', 4],
    ['fr-f-lt', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-f-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-f-all.js">Centre</a>'
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
