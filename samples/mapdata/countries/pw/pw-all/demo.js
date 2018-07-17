// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pw-6740', 0],
    ['pw-6753', 1],
    ['pw-6742', 2],
    ['pw-6741', 3],
    ['pw-6743', 4],
    ['pw-6747', 5],
    ['pw-6749', 6],
    ['pw-6751', 7],
    ['pw-6752', 8],
    ['pw-6746', 9],
    ['pw-6744', 10],
    ['pw-6748', 11],
    ['pw-6745', 12],
    ['pw-6750', 13],
    ['pw-6739', 14],
    ['pw-3596', 15],
    ['undefined', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pw/pw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pw/pw-all.js">Palau</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/pw/pw-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
