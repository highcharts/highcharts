// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['lt-kp', 0],
    ['lt-as', 1],
    ['lt-ks', 2],
    ['lt-ma', 3],
    ['lt-pa', 4],
    ['lt-sh', 5],
    ['lt-tg', 6],
    ['lt-vi', 7],
    ['lt-un', 8],
    ['lt-tl', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/lt/lt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/lt/lt-all.js">Lithuania</a>'
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
