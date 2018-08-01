// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['es-pm', 0],
    ['es-va', 1],
    ['es-le', 2],
    ['es-me', 3],
    ['es-p', 4],
    ['es-s', 5],
    ['es-na', 6],
    ['es-ce', 7],
    ['es-cu', 8],
    ['es-vi', 9],
    ['es-ss', 10],
    ['es-gr', 11],
    ['es-mu', 12],
    ['es-bu', 13],
    ['es-sa', 14],
    ['es-za', 15],
    ['es-hu', 16],
    ['es-m', 17],
    ['es-gu', 18],
    ['es-sg', 19],
    ['es-se', 20],
    ['es-t', 21],
    ['es-te', 22],
    ['es-v', 23],
    ['es-bi', 24],
    ['es-or', 25],
    ['es-l', 26],
    ['es-z', 27],
    ['es-gi', 28],
    ['es-ab', 29],
    ['es-a', 30],
    ['es-av', 31],
    ['es-cc', 32],
    ['es-to', 33],
    ['es-ba', 34],
    ['es-co', 35],
    ['es-h', 36],
    ['es-c', 37],
    ['es-ma', 38],
    ['es-po', 39],
    ['es-lo', 40],
    ['es-so', 41],
    ['es-al', 42],
    ['es-b', 43],
    ['es-ca', 44],
    ['es-o', 45],
    ['es-cs', 46],
    ['es-cr', 47],
    ['es-j', 48],
    ['es-lu', 49],
    ['es-tf', 50],
    ['es-gc', 51],
    ['undefined', 52]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/es/es-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/es/es-all.js">Spain</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/es/es-all'], 'mapline'),
        color: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
