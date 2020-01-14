// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-ara-ai', 0],
    ['fr-ara-hs', 1],
    ['fr-ara-sv', 2],
    ['fr-ara-dm', 3],
    ['fr-ara-ah', 4],
    ['fr-ara-is', 5],
    ['fr-ara-cl', 6],
    ['fr-ara-al', 7],
    ['fr-ara-lr', 8],
    ['fr-ara-pd', 9],
    ['fr-ara-hl', 10],
    ['fr-ara-rh', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-ara-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-ara-all.js">Auvergne-Rhône-Alpes</a>'
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
