// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-ab-4813', 0],
    ['ca-ab-4812', 1],
    ['ca-ab-4801', 2],
    ['ca-ab-4811', 3],
    ['ca-ab-4802', 4],
    ['ca-ab-4810', 5],
    ['ca-ab-4803', 6],
    ['ca-ab-4817', 7],
    ['ca-ab-4819', 8],
    ['ca-ab-4804', 9],
    ['ca-ab-4816', 10],
    ['ca-ab-4805', 11],
    ['ca-ab-4815', 12],
    ['ca-ab-4806', 13],
    ['ca-ab-4814', 14],
    ['ca-ab-4807', 15],
    ['ca-ab-4808', 16],
    ['ca-ab-4809', 17],
    ['ca-ab-4818', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-ab-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-ab-all.js">Alberta</a>'
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
