// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['np-750', 0],
    ['np-751', 1],
    ['np-752', 2],
    ['np-753', 3],
    ['np-754', 4],
    ['np-755', 5],
    ['np-756', 6],
    ['np-757', 7],
    ['np-354', 8],
    ['np-1278', 9],
    ['np-746', 10],
    ['np-747', 11],
    ['np-748', 12],
    ['np-749', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/np/np-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/np/np-all.js">Nepal</a>'
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
