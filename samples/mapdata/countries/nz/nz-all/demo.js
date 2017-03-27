// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nz-au', 0],
    ['nz-ma', 1],
    ['nz-so', 2],
    ['nz-wk', 3],
    ['nz-wg', 4],
    ['nz-4680', 5],
    ['nz-6943', 6],
    ['nz-6947', 7],
    ['nz-ca', 8],
    ['nz-ot', 9],
    ['nz-mw', 10],
    ['nz-gi', 11],
    ['nz-hb', 12],
    ['nz-bp', 13],
    ['nz-3315', 14],
    ['nz-3316', 15],
    ['nz-no', 16],
    ['nz-tk', 17],
    ['nz-wc', 18]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nz/nz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nz/nz-all.js">New Zealand</a>'
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
