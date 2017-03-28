// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tt-180', 0],
    ['tt-dm', 1],
    ['tt-tp', 2],
    ['tt-sf', 3],
    ['tt-ch', 4],
    ['tt-ps', 5],
    ['tt-193', 6],
    ['tt-6597', 7],
    ['tt-si', 8],
    ['tt-sn', 9],
    ['tt-mr', 10],
    ['tt-sl', 11],
    ['tt-pt', 12],
    ['tt-ct', 13],
    ['tt-pd', 14],
    ['tt-pf', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tt/tt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tt/tt-all.js">Trinidad and Tobago</a>'
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
