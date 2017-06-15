// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-ho-1251', 0],
    ['no-ho-1231', 1],
    ['no-ho-1233', 2],
    ['no-ho-1227', 3],
    ['no-ho-1241', 4],
    ['no-ho-1238', 5],
    ['no-ho-1252', 6],
    ['no-ho-1243', 7],
    ['no-ho-1245', 8],
    ['no-ho-1201', 9],
    ['no-ho-1246', 10],
    ['no-ho-1244', 11],
    ['no-ho-1242', 12],
    ['no-ho-1253', 13],
    ['no-ho-1222', 14],
    ['no-ho-1219', 15],
    ['no-ho-1224', 16],
    ['no-ho-1211', 17],
    ['no-ho-1223', 18],
    ['no-ho-1216', 19],
    ['no-ho-1234', 20],
    ['no-ho-1247', 21],
    ['no-ho-1232', 22],
    ['no-ho-1221', 23],
    ['no-ho-1263', 24],
    ['no-ho-1266', 25],
    ['no-ho-1228', 26],
    ['no-ho-1235', 27],
    ['no-ho-1259', 28],
    ['no-ho-1260', 29],
    ['no-ho-1265', 30],
    ['no-ho-1264', 31]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-ho-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-ho-all.js">Hordaland</a>'
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
