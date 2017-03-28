// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sr-ni', 0],
    ['sr-ma', 1],
    ['sr-pr', 2],
    ['sr-br', 3],
    ['sr-si', 4],
    ['sr-cm', 5],
    ['sr-cr', 6],
    ['sr-pm', 7],
    ['sr-sa', 8],
    ['sr-wa', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sr/sr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sr/sr-all.js">Suriname</a>'
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
