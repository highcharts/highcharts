// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fi-3280', 0],
    ['fi-3272', 1],
    ['fi-3275', 2],
    ['fi-3281', 3],
    ['fi-3279', 4],
    ['fi-3276', 5],
    ['fi-3287', 6],
    ['fi-3286', 7],
    ['fi-3290', 8],
    ['fi-3291', 9],
    ['fi-3292', 10],
    ['fi-3293', 11],
    ['fi-3294', 12],
    ['fi-3295', 13],
    ['fi-3296', 14],
    ['fi-3288', 15],
    ['fi-3285', 16],
    ['fi-3289', 17]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fi/fi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fi/fi-all.js">Finland</a>'
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
