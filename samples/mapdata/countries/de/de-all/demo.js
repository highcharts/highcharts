// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-ni', 0],
    ['de-sh', 1],
    ['de-be', 2],
    ['de-mv', 3],
    ['de-hb', 4],
    ['de-sl', 5],
    ['de-by', 6],
    ['de-th', 7],
    ['de-st', 8],
    ['de-sn', 9],
    ['de-bb', 10],
    ['de-nw', 11],
    ['de-bw', 12],
    ['de-he', 13],
    ['de-hh', 14],
    ['de-rp', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-all.js">Germany</a>'
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
