// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['be-3530', 0],
    ['be-3527', 1],
    ['be-3532', 2],
    ['be-3533', 3],
    ['be-3534', 4],
    ['be-3535', 5],
    ['be-3528', 6],
    ['be-3529', 7],
    ['be-489', 8],
    ['be-490', 9],
    ['be-3526', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/be/be-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/be/be-all.js">Belgium</a>'
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
