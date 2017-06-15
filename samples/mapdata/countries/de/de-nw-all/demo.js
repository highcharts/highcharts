// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-nw-05334000', 0],
    ['de-nw-05914000', 1],
    ['de-nw-05978000', 2],
    ['de-nw-05754000', 3],
    ['de-nw-05758000', 4],
    ['de-nw-05314000', 5],
    ['de-nw-05370000', 6],
    ['de-nw-05162000', 7],
    ['de-nw-05166000', 8],
    ['de-nw-05915000', 9],
    ['de-nw-05558000', 10],
    ['de-nw-05962000', 11],
    ['de-nw-05954000', 12],
    ['de-nw-05374000', 13],
    ['de-nw-05124000', 14],
    ['de-nw-05974000', 15],
    ['de-nw-05119000', 16],
    ['de-nw-05170000', 17],
    ['de-nw-05120000', 18],
    ['de-nw-05122000', 19],
    ['de-nw-05112000', 20],
    ['de-nw-05911000', 21],
    ['de-nw-05562000', 22],
    ['de-nw-05358000', 23],
    ['de-nw-05378000', 24],
    ['de-nw-05158000', 25],
    ['de-nw-05315000', 26],
    ['de-nw-05316000', 27],
    ['de-nw-05113000', 28],
    ['de-nw-05512000', 29],
    ['de-nw-05913000', 30],
    ['de-nw-05513000', 31],
    ['de-nw-05114000', 32],
    ['de-nw-05766000', 33],
    ['de-nw-05970000', 34],
    ['de-nw-05566000', 35],
    ['de-nw-05116000', 36],
    ['de-nw-05570000', 37],
    ['de-nw-05711000', 38],
    ['de-nw-05966000', 39],
    ['de-nw-05154000', 40],
    ['de-nw-05762000', 41],
    ['de-nw-05958000', 42],
    ['de-nw-05554000', 43],
    ['de-nw-05770000', 44],
    ['de-nw-05382000', 45],
    ['de-nw-05366000', 46],
    ['de-nw-05774000', 47],
    ['de-nw-05515000', 48],
    ['de-nw-05916000', 49],
    ['de-nw-05117000', 50],
    ['de-nw-05111000', 51],
    ['de-nw-05362000', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-nw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-nw-all.js">Nordrhein-Westfalen</a>'
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
