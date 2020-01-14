// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-bre', 0],
    ['fr-pdl', 1],
    ['fr-pac', 2],
    ['fr-occ', 3],
    ['fr-naq', 4],
    ['fr-bfc', 5],
    ['fr-cvl', 6],
    ['fr-idf', 7],
    ['fr-hdf', 8],
    ['fr-ara', 9],
    ['fr-ges', 10],
    ['fr-nor', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/custom/fr-all-mainland'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.js">France, mainland</a>'
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
