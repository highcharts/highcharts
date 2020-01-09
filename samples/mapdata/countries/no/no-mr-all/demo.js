// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-mr-1554', 0],
    ['no-mr-1531', 1],
    ['no-mr-1557', 2],
    ['no-mr-1539', 3],
    ['no-mr-1563', 4],
    ['no-mr-1578', 5],
    ['no-mr-1525', 6],
    ['no-mr-1547', 7],
    ['no-mr-1577', 8],
    ['no-mr-1566', 9],
    ['no-mr-1528', 10],
    ['no-mr-1520', 11],
    ['no-mr-1517', 12],
    ['no-mr-1516', 13],
    ['no-mr-1507', 14],
    ['no-mr-1511', 15],
    ['no-mr-1505', 16],
    ['no-mr-1579', 17],
    ['no-mr-1514', 18],
    ['no-mr-1506', 19],
    ['no-mr-1515', 20],
    ['no-mr-1532', 21],
    ['no-mr-1576', 22],
    ['no-mr-1573', 23],
    ['no-mr-1560', 24],
    ['no-mr-1535', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-mr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-mr-all.js">Møre og Romsdal</a>'
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
