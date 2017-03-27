// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gd-6584', 0],
    ['gd-3660', 1],
    ['gd-6583', 2],
    ['gd-6582', 3],
    ['gd-6581', 4],
    ['gd-6580', 5],
    ['gd-6579', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gd/gd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gd/gd-all.js">Grenada</a>'
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
