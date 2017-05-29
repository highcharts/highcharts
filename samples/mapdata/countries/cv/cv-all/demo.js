// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cv-br', 0],
    ['cv-ma', 1],
    ['cv-6566', 2],
    ['cv-6567', 3],
    ['cv-6570', 4],
    ['cv-sf', 5],
    ['cv-mo', 6],
    ['cv-cf', 7],
    ['cv-ta', 8],
    ['cv-ca', 9],
    ['cv-sm', 10],
    ['cv-cr', 11],
    ['cv-ss', 12],
    ['cv-so', 13],
    ['cv-sd', 14],
    ['cv-rs', 15],
    ['cv-pr', 16],
    ['cv-6568', 17],
    ['cv-6569', 18],
    ['cv-6571', 19],
    ['cv-6572', 20],
    ['cv-6573', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cv/cv-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cv/cv-all.js">Cape Verde</a>'
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
