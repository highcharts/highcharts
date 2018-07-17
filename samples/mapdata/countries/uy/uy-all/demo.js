// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['uy-sa', 0],
    ['uy-so', 1],
    ['uy-cl', 2],
    ['uy-du', 3],
    ['uy-rv', 4],
    ['uy-ta', 5],
    ['uy-tt', 6],
    ['uy-ca', 7],
    ['uy-fd', 8],
    ['uy-la', 9],
    ['uy-ma', 10],
    ['uy-mo', 11],
    ['uy-ro', 12],
    ['uy-co', 13],
    ['uy-sj', 14],
    ['uy-ar', 15],
    ['uy-fs', 16],
    ['uy-pa', 17],
    ['uy-rn', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/uy/uy-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/uy/uy-all.js">Uruguay</a>'
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
