// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cl-2730', 0],
    ['cl-bi', 1],
    ['cl-ll', 2],
    ['cl-li', 3],
    ['cl-ai', 4],
    ['cl-ma', 5],
    ['cl-co', 6],
    ['cl-at', 7],
    ['cl-vs', 8],
    ['cl-rm', 9],
    ['cl-ar', 10],
    ['cl-ml', 11],
    ['cl-ta', 12],
    ['cl-2740', 13],
    ['cl-an', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cl/cl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cl/cl-all.js">Chile</a>'
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
