// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ca-bc-5917', 0],
    ['ca-bc-5924', 1],
    ['ca-bc-5926', 2],
    ['ca-bc-5927', 3],
    ['ca-bc-5923', 4],
    ['ca-bc-5929', 5],
    ['ca-bc-5947', 6],
    ['ca-bc-5945', 7],
    ['ca-bc-5943', 8],
    ['ca-bc-5949', 9],
    ['ca-bc-5959', 10],
    ['ca-bc-5955', 11],
    ['ca-bc-5957', 12],
    ['ca-bc-5915', 13],
    ['ca-bc-5921', 14],
    ['ca-bc-5933', 15],
    ['ca-bc-5941', 16],
    ['ca-bc-5953', 17],
    ['ca-bc-5935', 18],
    ['ca-bc-5907', 19],
    ['ca-bc-5939', 20],
    ['ca-bc-5937', 21],
    ['ca-bc-5931', 22],
    ['ca-bc-5919', 23],
    ['ca-bc-5905', 24],
    ['ca-bc-5909', 25],
    ['ca-bc-5951', 26],
    ['ca-bc-5903', 27],
    ['ca-bc-5901', 28]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ca/ca-bc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ca/ca-bc-all.js">British Columbia</a>'
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
