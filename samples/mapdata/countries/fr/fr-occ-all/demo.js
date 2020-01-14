// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-occ-hp', 0],
    ['fr-occ-ga', 1],
    ['fr-occ-lz', 2],
    ['fr-occ-ag', 3],
    ['fr-occ-ad', 4],
    ['fr-occ-he', 5],
    ['fr-occ-ta', 6],
    ['fr-occ-tg', 7],
    ['fr-occ-av', 8],
    ['fr-occ-hg', 9],
    ['fr-occ-ge', 10],
    ['fr-occ-po', 11],
    ['fr-occ-lo', 12]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-occ-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-occ-all.js">Occitanie</a>'
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
