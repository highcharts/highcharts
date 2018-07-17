// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dk', 0],
    ['fo', 1],
    ['hr', 2],
    ['nl', 3],
    ['ee', 4],
    ['bg', 5],
    ['es', 6],
    ['it', 7],
    ['sm', 8],
    ['va', 9],
    ['tr', 10],
    ['mt', 11],
    ['fr', 12],
    ['no', 13],
    ['de', 14],
    ['ie', 15],
    ['ua', 16],
    ['fi', 17],
    ['se', 18],
    ['ru', 19],
    ['gb', 20],
    ['cy', 21],
    ['pt', 22],
    ['gr', 23],
    ['lt', 24],
    ['si', 25],
    ['ba', 26],
    ['mc', 27],
    ['al', 28],
    ['cnm', 29],
    ['nc', 30],
    ['rs', 31],
    ['ro', 32],
    ['me', 33],
    ['li', 34],
    ['at', 35],
    ['sk', 36],
    ['hu', 37],
    ['ad', 38],
    ['lu', 39],
    ['ch', 40],
    ['be', 41],
    ['kv', 42],
    ['pl', 43],
    ['mk', 44],
    ['lv', 45],
    ['by', 46],
    ['is', 47],
    ['md', 48],
    ['cz', 49]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/europe'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/europe.js">Europe</a>'
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
