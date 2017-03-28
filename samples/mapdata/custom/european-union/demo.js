// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dk', 0],
    ['de', 1],
    ['fr', 2],
    ['ie', 3],
    ['hr', 4],
    ['gb', 5],
    ['ee', 6],
    ['cy', 7],
    ['fi', 8],
    ['gr', 9],
    ['se', 10],
    ['nl', 11],
    ['es', 12],
    ['lt', 13],
    ['it', 14],
    ['mt', 15],
    ['nc', 16],
    ['pl', 17],
    ['sk', 18],
    ['hu', 19],
    ['lu', 20],
    ['si', 21],
    ['be', 22],
    ['cnm', 23],
    ['bg', 24],
    ['ro', 25],
    ['lv', 26],
    ['at', 27],
    ['cz', 28],
    ['pt', 29]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/european-union'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/european-union.js">European Union</a>'
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
