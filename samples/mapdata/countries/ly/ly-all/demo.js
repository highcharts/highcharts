// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ly-gd', 0],
    ['ly-ju', 1],
    ['ly-kf', 2],
    ['ly-mb', 3],
    ['ly-sh', 4],
    ['ly-gt', 5],
    ['ly-mq', 6],
    ['ly-mi', 7],
    ['ly-sb', 8],
    ['ly-ji', 9],
    ['ly-nq', 10],
    ['ly-za', 11],
    ['ly-mz', 12],
    ['ly-tn', 13],
    ['ly-sr', 14],
    ['ly-hz', 15],
    ['ly-ja', 16],
    ['ly-aj', 17],
    ['ly-ba', 18],
    ['ly-qb', 19],
    ['ly-bu', 20],
    ['ly-wh', 21]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ly/ly-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ly/ly-all.js">Libya</a>'
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
