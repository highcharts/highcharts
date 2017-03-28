// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-bb-12065000', 0],
    ['de-bb-12052000', 1],
    ['de-bb-12062000', 2],
    ['de-bb-12053000', 3],
    ['de-bb-12072000', 4],
    ['de-bb-12063000', 5],
    ['de-bb-12060000', 6],
    ['de-bb-12066000', 7],
    ['de-bb-12068000', 8],
    ['de-bb-12054000', 9],
    ['de-bb-12061000', 10],
    ['de-bb-12051000', 11],
    ['de-bb-12067000', 12],
    ['de-bb-12071000', 13],
    ['de-bb-12070000', 14],
    ['de-bb-12069000', 15],
    ['de-bb-12073000', 16],
    ['de-bb-12064000', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-bb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-bb-all.js">Brandenburg</a>'
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
