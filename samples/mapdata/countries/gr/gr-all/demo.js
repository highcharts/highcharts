// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gr-as', 0],
    ['gr-ii', 1],
    ['gr-at', 2],
    ['gr-pp', 3],
    ['gr-ts', 4],
    ['gr-an', 5],
    ['gr-gc', 6],
    ['gr-cr', 7],
    ['gr-mc', 8],
    ['gr-ma', 9],
    ['gr-mt', 10],
    ['gr-gw', 11],
    ['gr-mw', 12],
    ['gr-ep', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gr/gr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gr/gr-all.js">Greece</a>'
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
