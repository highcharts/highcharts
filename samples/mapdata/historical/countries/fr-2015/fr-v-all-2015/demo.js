// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-v-ai', 0],
    ['fr-v-hs', 1],
    ['fr-v-sv', 2],
    ['fr-v-dm', 3],
    ['fr-v-ah', 4],
    ['fr-v-is', 5],
    ['fr-v-lr', 6],
    ['fr-v-rh', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'historical/countries/fr-2015/fr-v-all-2015'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-v-all-2015.js">Rhône-Alpes (2015)</a>'
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

    series: [
        {
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
        }
    ]
});
