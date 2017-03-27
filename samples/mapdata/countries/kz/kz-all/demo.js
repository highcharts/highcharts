// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kz-5085', 0],
    ['kz-qo', 1],
    ['kz-ac', 2],
    ['kz-as', 3],
    ['kz-qs', 4],
    ['kz-nk', 5],
    ['kz-pa', 6],
    ['kz-am', 7],
    ['kz-zm', 8],
    ['kz-ek', 9],
    ['kz-ar', 10],
    ['kz-mg', 11],
    ['kz-aa', 12],
    ['kz-at', 13],
    ['kz-wk', 14],
    ['kz-sk', 15],
    ['kz-qg', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kz/kz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kz/kz-all.js">Kazakhstan</a>'
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
