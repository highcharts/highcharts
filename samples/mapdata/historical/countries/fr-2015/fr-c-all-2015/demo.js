// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-c-cl', 0],
    ['fr-c-al', 1],
    ['fr-c-pd', 2],
    ['fr-c-hl', 3]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'historical/countries/fr-2015/fr-c-all-2015'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-c-all-2015.js">Auvergne (2015)</a>'
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
