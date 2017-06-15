// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-sf-1428', 0],
    ['no-sf-1429', 1],
    ['no-sf-1430', 2],
    ['no-sf-1420', 3],
    ['no-sf-1422', 4],
    ['no-sf-1445', 5],
    ['no-sf-1426', 6],
    ['no-sf-1424', 7],
    ['no-sf-1443', 8],
    ['no-sf-1418', 9],
    ['no-sf-1439', 10],
    ['no-sf-1412', 11],
    ['no-sf-1413', 12],
    ['no-sf-1417', 13],
    ['no-sf-1421', 14],
    ['no-sf-1432', 15],
    ['no-sf-1433', 16],
    ['no-sf-1431', 17],
    ['no-sf-1401', 18],
    ['no-sf-1441', 19],
    ['no-sf-1444', 20],
    ['no-sf-1449', 21],
    ['no-sf-1419', 22],
    ['no-sf-1438', 23],
    ['no-sf-1411', 24],
    ['no-sf-1416', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-sf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-sf-all.js">Sogn og Fjordane</a>'
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
