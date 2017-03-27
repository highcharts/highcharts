// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bi-br', 0],
    ['bi-bb', 1],
    ['bi-ci', 2],
    ['bi-gi', 3],
    ['bi-ky', 4],
    ['bi-ma', 5],
    ['bi-ng', 6],
    ['bi-ki', 7],
    ['bi-my', 8],
    ['bi-bm', 9],
    ['bi-mv', 10],
    ['bi-bu', 11],
    ['bi-mw', 12],
    ['bi-ca', 13],
    ['bi-kr', 14],
    ['bi-rt', 15],
    ['bi-ry', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bi/bi-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bi/bi-all.js">Burundi</a>'
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
