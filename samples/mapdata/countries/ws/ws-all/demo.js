// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ws-3586', 0],
    ['ws-6500', 1],
    ['ws-6501', 2],
    ['ws-6502', 3],
    ['ws-6503', 4],
    ['ws-6504', 5],
    ['ws-6505', 6],
    ['ws-6506', 7],
    ['ws-6507', 8],
    ['ws-6508', 9],
    ['ws-6509', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ws/ws-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ws/ws-all.js">Samoa</a>'
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
