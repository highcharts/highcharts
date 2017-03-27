// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-mr-1566', 0],
    ['no-mr-1576', 1],
    ['no-mr-1554', 2],
    ['no-mr-1511', 3],
    ['no-mr-1526', 4],
    ['no-mr-1524', 5],
    ['no-mr-1525', 6],
    ['no-mr-1528', 7],
    ['no-mr-1523', 8],
    ['no-mr-1539', 9],
    ['no-mr-1535', 10],
    ['no-mr-1529', 11],
    ['no-mr-1514', 12],
    ['no-mr-1563', 13],
    ['no-mr-1502', 14],
    ['no-mr-1551', 15],
    ['no-mr-1531', 16],
    ['no-mr-1504', 17],
    ['no-mr-1505', 18],
    ['no-mr-1557', 19],
    ['no-mr-1519', 20],
    ['no-mr-1547', 21],
    ['no-mr-1520', 22],
    ['no-mr-1517', 23],
    ['no-mr-1516', 24],
    ['no-mr-1548', 25],
    ['no-mr-1545', 26],
    ['no-mr-1571', 27],
    ['no-mr-1515', 28],
    ['no-mr-1534', 29],
    ['no-mr-1532', 30],
    ['no-mr-1567', 31],
    ['no-mr-1573', 32],
    ['no-mr-1560', 33],
    ['no-mr-1546', 34],
    ['no-mr-1543', 35]
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
