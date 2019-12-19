// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['fr-cor', 0],
    ['fr-bre', 1],
    ['fr-pdl', 2],
    ['fr-pac', 3],
    ['fr-occ', 4],
    ['fr-naq', 5],
    ['fr-bfc', 6],
    ['fr-cvl', 7],
    ['fr-idf', 8],
    ['fr-hdf', 9],
    ['fr-ara', 10],
    ['fr-ges', 11],
    ['fr-nor', 12],
    ['fr-lre', 13],
    ['fr-may', 14],
    ['fr-gf', 15],
    ['fr-mq', 16],
    ['fr-gua', 17],
    ['undefined', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/fr/fr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/fr-all.js">France</a>'
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
        data: Highcharts.geojson(Highcharts.maps['countries/fr/fr-all'], 'mapline'),
        color: 'silver',
        nullColor: 'silver',
        showInLegend: false,
        enableMouseTracking: false
    }]
});
