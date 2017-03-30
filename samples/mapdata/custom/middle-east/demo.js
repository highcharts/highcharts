// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sa', 0],
    ['bh', 1],
    ['tr', 2],
    ['om', 3],
    ['ir', 4],
    ['ye', 5],
    ['kw', 6],
    ['eg', 7],
    ['il', 8],
    ['jo', 9],
    ['iq', 10],
    ['qa', 11],
    ['ae', 12],
    ['sy', 13],
    ['lb', 14],
    ['cy', 15],
    ['nc', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/middle-east'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/middle-east.js">Middle East</a>'
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
