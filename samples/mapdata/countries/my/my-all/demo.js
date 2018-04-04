// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['my-sa', 0],
    ['my-sk', 1],
    ['my-la', 2],
    ['my-pg', 3],
    ['my-kh', 4],
    ['my-sl', 5],
    ['my-ph', 6],
    ['my-kl', 7],
    ['my-pj', 8],
    ['my-pl', 9],
    ['my-jh', 10],
    ['my-pk', 11],
    ['my-kn', 12],
    ['my-me', 13],
    ['my-ns', 14],
    ['my-te', 15],
    ['undefined', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/my/my-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/my/my-all.js">Malaysia</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/my/my-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
