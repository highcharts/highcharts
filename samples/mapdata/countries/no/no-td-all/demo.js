// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['no-td-5058', 0],
    ['no-td-5057', 1],
    ['no-td-5014', 2],
    ['no-td-5031', 3],
    ['no-td-5049', 4],
    ['no-td-5056', 5],
    ['no-td-5034', 6],
    ['no-td-5032', 7],
    ['no-td-5054', 8],
    ['no-td-5059', 9],
    ['no-mr-5061', 10],
    ['no-td-5022', 11],
    ['no-td-5037', 12],
    ['no-td-5035', 13],
    ['no-td-5053', 14],
    ['no-td-5038', 15],
    ['no-td-5028', 16],
    ['no-td-5045', 17],
    ['no-td-5042', 18],
    ['no-td-5001', 19],
    ['no-td-5027', 20],
    ['no-mr-5055', 21],
    ['no-td-5047', 22],
    ['no-td-5006', 23],
    ['no-td-5052', 24],
    ['no-td-5020', 25],
    ['no-td-5026', 26],
    ['no-td-5041', 27],
    ['no-td-5044', 28],
    ['no-td-5025', 29],
    ['no-td-5033', 30],
    ['no-td-5043', 31],
    ['no-td-5036', 32],
    ['no-td-5021', 33],
    ['no-td-5029', 34],
    ['no-td-5060', 35],
    ['no-td-5007', 36],
    ['no-td-5046', 37]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/no/no-td-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/no/no-td-all.js">Trøndelag</a>'
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
