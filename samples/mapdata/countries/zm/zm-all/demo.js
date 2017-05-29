// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['zm-lp', 0],
    ['zm-no', 1],
    ['zm-ce', 2],
    ['zm-ea', 3],
    ['zm-ls', 4],
    ['zm-co', 5],
    ['zm-nw', 6],
    ['zm-so', 7],
    ['zm-we', 8],
    ['zm-mu', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/zm/zm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/zm/zm-all.js">Zambia</a>'
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
