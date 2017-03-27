// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ar-tf', 0],
    ['ar-ba', 1],
    ['ar-sj', 2],
    ['ar-mz', 3],
    ['ar-nq', 4],
    ['ar-lp', 5],
    ['ar-rn', 6],
    ['ar-sl', 7],
    ['ar-cb', 8],
    ['ar-ct', 9],
    ['ar-lr', 10],
    ['ar-sa', 11],
    ['ar-se', 12],
    ['ar-tm', 13],
    ['ar-cc', 14],
    ['ar-fm', 15],
    ['ar-cn', 16],
    ['ar-er', 17],
    ['ar-ch', 18],
    ['ar-sf', 19],
    ['ar-mn', 20],
    ['ar-df', 21],
    ['ar-sc', 22],
    ['ar-jy', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ar/ar-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ar/ar-all.js">Argentina</a>'
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
