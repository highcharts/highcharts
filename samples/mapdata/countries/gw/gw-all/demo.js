// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gw-bm', 0],
    ['gw-bl', 1],
    ['gw-ga', 2],
    ['gw-to', 3],
    ['gw-bs', 4],
    ['gw-ca', 5],
    ['gw-oi', 6],
    ['gw-qu', 7],
    ['gw-ba', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gw/gw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gw/gw-all.js">Guinea Bissau</a>'
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
