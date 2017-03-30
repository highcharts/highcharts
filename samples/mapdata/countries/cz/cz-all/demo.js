// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cz-2293', 0],
    ['cz-6305', 1],
    ['cz-6306', 2],
    ['cz-6307', 3],
    ['cz-6308', 4],
    ['cz-kk', 5],
    ['cz-ck', 6],
    ['cz-jk', 7],
    ['cz-sk', 8],
    ['cz-lk', 9],
    ['cz-hk', 10],
    ['cz-vk', 11],
    ['cz-6303', 12],
    ['cz-6304', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cz/cz-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cz/cz-all.js">Czech Republic</a>'
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
