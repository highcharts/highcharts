// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ec-gu', 0],
    ['ec-es', 1],
    ['ec-cr', 2],
    ['ec-im', 3],
    ['ec-su', 4],
    ['ec-se', 5],
    ['ec-sd', 6],
    ['ec-az', 7],
    ['ec-eo', 8],
    ['ec-lj', 9],
    ['ec-zc', 10],
    ['ec-cn', 11],
    ['ec-bo', 12],
    ['ec-ct', 13],
    ['ec-lr', 14],
    ['ec-mn', 15],
    ['ec-cb', 16],
    ['ec-ms', 17],
    ['ec-pi', 18],
    ['ec-pa', 19],
    ['ec-1076', 20],
    ['ec-na', 21],
    ['ec-tu', 22],
    ['ec-ga', 23],
    ['undefined', 24]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ec/ec-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ec/ec-all.js">Ecuador</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/ec/ec-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
