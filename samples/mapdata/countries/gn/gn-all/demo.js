// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gn-7097', 0],
    ['gn-7087', 1],
    ['gn-7108', 2],
    ['gn-3417', 3],
    ['gn-7106', 4],
    ['gn-3420', 5],
    ['gn-7098', 6],
    ['gn-7101', 7],
    ['gn-7092', 8],
    ['gn-7088', 9],
    ['gn-7103', 10],
    ['gn-3416', 11],
    ['gn-7094', 12],
    ['gn-7111', 13],
    ['gn-7109', 14],
    ['gn-7091', 15],
    ['gn-3418', 16],
    ['gn-7105', 17],
    ['gn-3421', 18],
    ['gn-7099', 19],
    ['gn-7104', 20],
    ['gn-7093', 21],
    ['gn-7107', 22],
    ['gn-7112', 23],
    ['gn-7090', 24],
    ['gn-7110', 25],
    ['gn-7089', 26],
    ['gn-3419', 27],
    ['gn-7096', 28],
    ['gn-7100', 29],
    ['gn-7102', 30],
    ['gn-7095', 31],
    ['gn-3422', 32],
    ['gn-3423', 33]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gn/gn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gn/gn-all.js">Guinea</a>'
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
