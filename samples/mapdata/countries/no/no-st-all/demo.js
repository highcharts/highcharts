// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-st-1621', 0],
    ['no-st-1620', 1],
    ['no-st-1627', 2],
    ['no-st-1663', 3],
    ['no-st-1630', 4],
    ['no-st-1617', 5],
    ['no-st-1640', 6],
    ['no-st-1662', 7],
    ['no-st-1648', 8],
    ['no-st-1601', 9],
    ['no-st-1644', 10],
    ['no-st-1622', 11],
    ['no-st-1624', 12],
    ['no-st-1635', 13],
    ['no-st-1632', 14],
    ['no-st-1634', 15],
    ['no-st-1636', 16],
    ['no-st-1638', 17],
    ['no-st-1665', 18],
    ['no-st-1612', 19],
    ['no-st-1653', 20],
    ['no-st-1613', 21],
    ['no-st-1657', 22],
    ['no-st-1664', 23],
    ['no-st-1633', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-st-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-st-all.js">Sør-Trøndelag</a>'
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
