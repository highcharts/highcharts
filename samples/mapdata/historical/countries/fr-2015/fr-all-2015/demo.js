// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-t', 0],
    ['fr-h', 1],
    ['fr-e', 2],
    ['fr-r', 3],
    ['fr-u', 4],
    ['fr-n', 5],
    ['fr-p', 6],
    ['fr-o', 7],
    ['fr-v', 8],
    ['fr-s', 9],
    ['fr-g', 10],
    ['fr-k', 11],
    ['fr-a', 12],
    ['fr-c', 13],
    ['fr-f', 14],
    ['fr-l', 15],
    ['fr-d', 16],
    ['fr-b', 17],
    ['fr-i', 18],
    ['fr-q', 19],
    ['fr-j', 20],
    ['fr-m', 21],
    ['fr-re', 22],
    ['fr-yt', 23],
    ['fr-gf', 24],
    ['fr-mq', 25],
    ['fr-gp', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'historical/countries/fr-2015/fr-all-2015'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/historical/countries/fr-2015/fr-all-2015.js">France (2015)</a>'
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
    }, {
        name: 'Separators',
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['historical/countries/fr-2015/fr-all-2015'], 'mapline'),
        color: 'silver',
        nullColor: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
