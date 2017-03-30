// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tl-dl', 0],
    ['tl-am', 1],
    ['tl-bb', 2],
    ['tl-cl', 3],
    ['tl-er', 4],
    ['tl-mt', 5],
    ['tl-mf', 6],
    ['tl-vq', 7],
    ['tl-bt', 8],
    ['tl-lq', 9],
    ['tl-al', 10],
    ['tl-an', 11],
    ['tl-bc', 12]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/tl/tl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/tl/tl-all.js">East Timor</a>'
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
