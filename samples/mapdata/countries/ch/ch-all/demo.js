// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ch-fr', 0],
    ['ch-lu', 1],
    ['ch-ni', 2],
    ['ch-vs', 3],
    ['ch-sg', 4],
    ['ch-ar', 5],
    ['ch-ti', 6],
    ['ch-gl', 7],
    ['ch-gr', 8],
    ['ch-sz', 9],
    ['ch-tg', 10],
    ['ch-sh', 11],
    ['ch-ur', 12],
    ['ch-zh', 13],
    ['ch-zg', 14],
    ['ch-vd', 15],
    ['ch-bl', 16],
    ['ch-be', 17],
    ['ch-bs', 18],
    ['ch-so', 19],
    ['ch-nw', 20],
    ['ch-ai', 21],
    ['ch-ge', 22],
    ['ch-ju', 23],
    ['ch-ne', 24],
    ['ch-ag', 25]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ch/ch-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ch/ch-all.js">Switzerland</a>'
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
