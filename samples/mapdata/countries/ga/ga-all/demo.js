// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ga-om', 0],
    ['ga-mo', 1],
    ['ga-es', 2],
    ['ga-ng', 3],
    ['ga-ny', 4],
    ['ga-ho', 5],
    ['ga-ol', 6],
    ['ga-oi', 7],
    ['ga-wn', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ga/ga-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ga/ga-all.js">Gabon</a>'
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
