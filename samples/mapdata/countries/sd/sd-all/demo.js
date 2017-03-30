// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sd-rs', 0],
    ['sd-711', 1],
    ['sd-7281', 2],
    ['sd-wd', 3],
    ['sd-kh', 4],
    ['sd-gz', 5],
    ['sd-gd', 6],
    ['sd-rn', 7],
    ['sd-no', 8],
    ['sd-kn', 9],
    ['sd-wn', 10],
    ['sd-si', 11],
    ['sd-nd', 12],
    ['sd-ks', 13],
    ['sd-sd', 14],
    ['sd-ka', 15],
    ['sd-bn', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sd/sd-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sd/sd-all.js">Sudan</a>'
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
