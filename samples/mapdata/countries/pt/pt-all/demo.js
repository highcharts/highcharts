// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pt-fa', 0],
    ['pt-li', 1],
    ['pt-av', 2],
    ['pt-vc', 3],
    ['pt-be', 4],
    ['pt-ev', 5],
    ['pt-se', 6],
    ['pt-pa', 7],
    ['pt-sa', 8],
    ['pt-br', 9],
    ['pt-le', 10],
    ['pt-ba', 11],
    ['pt-cb', 12],
    ['pt-gu', 13],
    ['pt-co', 14],
    ['pt-po', 15],
    ['pt-vi', 16],
    ['pt-vr', 17],
    ['pt-ma', 18],
    ['pt-ac', 19],
    ['undefined', 20]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pt/pt-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pt/pt-all.js">Portugal</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/pt/pt-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
