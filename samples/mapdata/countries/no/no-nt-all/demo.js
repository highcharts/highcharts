// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-nt-1749', 0],
    ['no-nt-1755', 1],
    ['no-nt-1703', 2],
    ['no-nt-1750', 3],
    ['no-nt-1719', 4],
    ['no-nt-1748', 5],
    ['no-nt-1744', 6],
    ['no-nt-1718', 7],
    ['no-nt-1724', 8],
    ['no-nt-1702', 9],
    ['no-nt-1725', 10],
    ['no-nt-1721', 11],
    ['no-nt-1736', 12],
    ['no-nt-1740', 13],
    ['no-nt-1743', 14],
    ['no-nt-1739', 15],
    ['no-nt-1742', 16],
    ['no-nt-1714', 17],
    ['no-nt-1738', 18],
    ['no-nt-1711', 19],
    ['no-nt-1717', 20],
    ['no-nt-1756', 21],
    ['no-nt-1751', 22]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-nt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-nt-all.js">Nord-Trøndelag</a>'
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
