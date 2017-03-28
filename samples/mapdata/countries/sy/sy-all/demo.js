// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sy-di', 0],
    ['sy-hl', 1],
    ['sy-hm', 2],
    ['sy-hi', 3],
    ['sy-id', 4],
    ['sy-ha', 5],
    ['sy-dy', 6],
    ['sy-su', 7],
    ['sy-rd', 8],
    ['sy-qu', 9],
    ['sy-dr', 10],
    ['sy-3686', 11],
    ['sy-la', 12],
    ['sy-ta', 13],
    ['sy-ra', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sy/sy-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sy/sy-all.js">Syria</a>'
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
