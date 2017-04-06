// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bb-mi', 0],
    ['bb-pe', 1],
    ['bb-an', 2],
    ['bb-ph', 3],
    ['bb-cc', 4],
    ['bb-th', 5],
    ['bb-ge', 6],
    ['bb-jm', 7],
    ['bb-jn', 8],
    ['bb-js', 9],
    ['bb-lu', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bb/bb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bb/bb-all.js">Barbados</a>'
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
