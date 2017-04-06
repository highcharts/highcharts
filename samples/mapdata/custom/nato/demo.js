// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dk', 0],
    ['de', 1],
    ['gl', 2],
    ['fr', 3],
    ['no', 4],
    ['us', 5],
    ['ca', 6],
    ['hr', 7],
    ['gb', 8],
    ['ee', 9],
    ['gr', 10],
    ['nl', 11],
    ['es', 12],
    ['lt', 13],
    ['it', 14],
    ['tr', 15],
    ['pl', 16],
    ['sk', 17],
    ['bg', 18],
    ['lv', 19],
    ['hu', 20],
    ['lu', 21],
    ['si', 22],
    ['be', 23],
    ['al', 24],
    ['ro', 25],
    ['pt', 26],
    ['is', 27],
    ['cz', 28]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/nato'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/nato.js">North Atlantic Treaty Organization</a>'
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
