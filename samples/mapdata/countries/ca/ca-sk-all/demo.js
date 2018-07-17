// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-sk-4711', 0],
    ['ca-sk-4708', 1],
    ['ca-sk-4706', 2],
    ['ca-sk-4707', 3],
    ['ca-sk-4705', 4],
    ['ca-sk-4714', 5],
    ['ca-sk-4704', 6],
    ['ca-sk-4715', 7],
    ['ca-sk-4703', 8],
    ['ca-sk-4702', 9],
    ['ca-sk-4716', 10],
    ['ca-sk-4701', 11],
    ['ca-sk-4717', 12],
    ['ca-sk-4710', 13],
    ['ca-sk-4712', 14],
    ['ca-sk-4713', 15],
    ['ca-sk-4718', 16],
    ['ca-sk-4709', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-sk-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-sk-all.js">Saskatchewan</a>'
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
