// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['iq-na', 0],
    ['iq-ka', 1],
    ['iq-ba', 2],
    ['iq-mu', 3],
    ['iq-qa', 4],
    ['iq-dq', 5],
    ['iq-ma', 6],
    ['iq-wa', 7],
    ['iq-sd', 8],
    ['iq-su', 9],
    ['iq-di', 10],
    ['iq-bb', 11],
    ['iq-bg', 12],
    ['iq-an', 13],
    ['iq-ar', 14],
    ['iq-ts', 15],
    ['iq-da', 16],
    ['iq-ni', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/iq/iq-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/iq/iq-all.js">Iraq</a>'
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
