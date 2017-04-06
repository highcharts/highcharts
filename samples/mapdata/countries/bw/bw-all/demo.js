// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bw-6964', 0],
    ['bw-6963', 1],
    ['bw-6967', 2],
    ['bw-6966', 3],
    ['bw-kg', 4],
    ['bw-se', 5],
    ['bw-ne', 6],
    ['bw-6962', 7],
    ['bw-gh', 8],
    ['bw-nw', 9],
    ['bw-ce', 10],
    ['bw-kl', 11],
    ['bw-kw', 12],
    ['bw-6965', 13],
    ['bw-so', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bw/bw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bw/bw-all.js">Botswana</a>'
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
