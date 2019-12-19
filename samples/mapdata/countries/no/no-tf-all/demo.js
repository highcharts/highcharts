// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-tf-5429', 0],
    ['no-tf-5427', 1],
    ['no-tf-5401', 2],
    ['no-tf-5402', 3],
    ['no-tf-5434', 4],
    ['no-tf-5432', 5],
    ['no-tf-5436', 6],
    ['no-tf-5444', 7],
    ['no-tf-5419', 8],
    ['no-tf-5424', 9],
    ['no-tf-5423', 10],
    ['no-tf-5404', 11],
    ['no-tf-5414', 12],
    ['no-tf-5413', 13],
    ['no-tf-5442', 14],
    ['no-tf-5441', 15],
    ['no-tf-5420', 16],
    ['no-tf-3020', 17],
    ['no-tf-5433', 18],
    ['no-tf-5415', 19],
    ['no-tf-5416', 20],
    ['no-tf-5403', 21],
    ['no-tf-5437', 22],
    ['no-tf-5417', 23],
    ['no-tf-5421', 24],
    ['no-tf-5425', 25],
    ['no-tf-5418', 26],
    ['no-tf-5428', 27],
    ['no-tf-5426', 28],
    ['no-tf-5412', 29],
    ['no-tf-5406', 30],
    ['no-tf-5430', 31],
    ['no-tf-5438', 32],
    ['no-tf-5411', 33],
    ['no-tf-5440', 34],
    ['no-tf-5439', 35],
    ['no-tf-5443', 36],
    ['no-tf-5422', 37],
    ['no-tf-5405', 38]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-tf-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-tf-all.js">Troms og Finnmark</a>'
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
