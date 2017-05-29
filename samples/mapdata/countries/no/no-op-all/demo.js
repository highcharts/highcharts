// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-op-522', 0],
    ['no-op-542', 1],
    ['no-op-513', 2],
    ['no-op-519', 3],
    ['no-op-517', 4],
    ['no-op-543', 5],
    ['no-op-515', 6],
    ['no-op-544', 7],
    ['no-op-511', 8],
    ['no-op-516', 9],
    ['no-op-541', 10],
    ['no-op-545', 11],
    ['no-op-520', 12],
    ['no-op-532', 13],
    ['no-op-529', 14],
    ['no-op-502', 15],
    ['no-op-538', 16],
    ['no-op-501', 17],
    ['no-op-528', 18],
    ['no-op-521', 19],
    ['no-op-534', 20],
    ['no-op-533', 21],
    ['no-op-512', 22],
    ['no-op-540', 23],
    ['no-op-514', 24],
    ['no-op-536', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-op-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-op-all.js">Oppland</a>'
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
