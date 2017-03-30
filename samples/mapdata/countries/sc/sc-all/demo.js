// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sc-6700', 0],
    ['sc-6707', 1],
    ['sc-6708', 2],
    ['sc-6711', 3],
    ['sc-6714', 4],
    ['sc-6702', 5],
    ['sc-6703', 6],
    ['sc-6704', 7],
    ['sc-6705', 8],
    ['sc-6706', 9],
    ['sc-6709', 10],
    ['sc-6710', 11],
    ['sc-6712', 12],
    ['sc-6713', 13],
    ['sc-6715', 14],
    ['sc-6716', 15],
    ['sc-6717', 16],
    ['sc-6718', 17],
    ['sc-6694', 18],
    ['sc-6695', 19],
    ['sc-6696', 20],
    ['sc-6697', 21],
    ['sc-6698', 22],
    ['sc-6699', 23],
    ['sc-6701', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sc/sc-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sc/sc-all.js">Seychelles</a>'
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
