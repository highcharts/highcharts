// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pl-ld', 0],
    ['pl-mz', 1],
    ['pl-sk', 2],
    ['pl-pd', 3],
    ['pl-lu', 4],
    ['pl-pk', 5],
    ['pl-op', 6],
    ['pl-ma', 7],
    ['pl-wn', 8],
    ['pl-pm', 9],
    ['pl-ds', 10],
    ['pl-zp', 11],
    ['pl-lb', 12],
    ['pl-wp', 13],
    ['pl-kp', 14],
    ['pl-sl', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pl/pl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pl/pl-all.js">Poland</a>'
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
