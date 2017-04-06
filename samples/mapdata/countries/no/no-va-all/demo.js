// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-va-1004', 0],
    ['no-va-1001', 1],
    ['no-va-1014', 2],
    ['no-va-1032', 3],
    ['no-va-1037', 4],
    ['no-va-1046', 5],
    ['no-va-1034', 6],
    ['no-va-1003', 7],
    ['no-va-1027', 8],
    ['no-va-1026', 9],
    ['no-va-1021', 10],
    ['no-va-1018', 11],
    ['no-va-1002', 12],
    ['no-va-1017', 13],
    ['no-va-1029', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-va-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-va-all.js">Vest-Agder</a>'
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
