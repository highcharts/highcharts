// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-nb-1315', 0],
    ['ca-nb-1302', 1],
    ['ca-nb-1314', 2],
    ['ca-nb-1308', 3],
    ['ca-nb-1304', 4],
    ['ca-nb-1306', 5],
    ['ca-nb-1305', 6],
    ['ca-nb-1312', 7],
    ['ca-nb-1311', 8],
    ['ca-nb-1310', 9],
    ['ca-nb-1313', 10],
    ['ca-nb-1307', 11],
    ['ca-nb-1303', 12],
    ['ca-nb-1309', 13],
    ['ca-nb-1301', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-nb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-nb-all.js">New Brunswick</a>'
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
