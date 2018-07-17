// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kv-841', 0],
    ['kv-7318', 1],
    ['kv-7319', 2],
    ['kv-7320', 3],
    ['kv-7321', 4],
    ['kv-7322', 5],
    ['kv-844', 6],
    ['kv-7302', 7],
    ['kv-7303', 8],
    ['kv-7304', 9],
    ['kv-7305', 10],
    ['kv-7306', 11],
    ['kv-845', 12],
    ['kv-7307', 13],
    ['kv-7308', 14],
    ['kv-7309', 15],
    ['kv-7310', 16],
    ['kv-7311', 17],
    ['kv-842', 18],
    ['kv-7312', 19],
    ['kv-7313', 20],
    ['kv-7314', 21],
    ['kv-843', 22],
    ['kv-7315', 23],
    ['kv-7316', 24],
    ['kv-7317', 25],
    ['kv-7323', 26],
    ['kv-7324', 27],
    ['kv-7325', 28],
    ['kv-7326', 29]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kv/kv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kv/kv-all.js">Kosovo</a>'
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
