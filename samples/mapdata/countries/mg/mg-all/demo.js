// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['mg-987', 0],
    ['mg-993', 1],
    ['mg-7296', 2],
    ['mg-7287', 3],
    ['mg-997', 4],
    ['mg-7285', 5],
    ['mg-7289', 6],
    ['mg-7283', 7],
    ['mg-7290', 8],
    ['mg-7292', 9],
    ['mg-7297', 10],
    ['mg-7294', 11],
    ['mg-7286', 12],
    ['mg-995', 13],
    ['mg-994', 14],
    ['mg-996', 15],
    ['mg-7293', 16],
    ['mg-7284', 17],
    ['mg-7298', 18],
    ['mg-7295', 19],
    ['mg-7288', 20],
    ['mg-7291', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/mg/mg-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/mg/mg-all.js">Madagascar</a>'
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
