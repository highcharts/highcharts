// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gl-3278', 0],
    ['gl-3274', 1],
    ['gl-3297', 2],
    ['gl-2728', 3],
    ['gl-3282', 4],
    ['gl-3298', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gl/gl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gl/gl-all.js">Greenland</a>'
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
