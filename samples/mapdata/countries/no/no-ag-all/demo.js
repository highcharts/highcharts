// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-ag-4207', 0],
    ['no-ag-4201', 1],
    ['no-ag-4217', 2],
    ['no-ag-4203', 3],
    ['no-ag-4222', 4],
    ['no-ag-4219', 5],
    ['no-ag-4224', 6],
    ['no-ag-4202', 7],
    ['no-ag-4228', 8],
    ['no-ag-4225', 9],
    ['no-ag-4205', 10],
    ['no-ag-4227', 11],
    ['no-ag-4214', 12],
    ['no-ag-4204', 13],
    ['no-ag-4216', 14],
    ['no-ag-4226', 15],
    ['no-ag-4223', 16],
    ['no-ag-4220', 17],
    ['no-ag-4218', 18],
    ['no-ag-4213', 19],
    ['no-ag-4211', 20],
    ['no-ag-4206', 21],
    ['no-ag-4212', 22],
    ['no-ag-4215', 23],
    ['no-ag-4221', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-ag-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-ag-all.js">Agder</a>'
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
