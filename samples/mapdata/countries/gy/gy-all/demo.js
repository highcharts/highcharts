// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gy-de', 0],
    ['gy-ma', 1],
    ['gy-pt', 2],
    ['gy-ut', 3],
    ['gy-ud', 4],
    ['gy-pm', 5],
    ['gy-ba', 6],
    ['gy-eb', 7],
    ['gy-es', 8],
    ['gy-cu', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gy/gy-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gy/gy-all.js">Guyana</a>'
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
