// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nz-6471', 0],
    ['nz-6475', 1],
    ['nz-3583', 2],
    ['nz-6470', 3],
    ['nz-6473', 4],
    ['nz-6474', 5],
    ['nz-6476', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ck/ck-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ck/ck-all.js">Cook Islands</a>'
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
