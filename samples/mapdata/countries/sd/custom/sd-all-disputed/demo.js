// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sd-wd', 0],
    ['sd-kh', 1],
    ['sd-gz', 2],
    ['sd-gd', 3],
    ['sd-rn', 4],
    ['sd-no', 5],
    ['sd-kn', 6],
    ['sd-wn', 7],
    ['sd-si', 8],
    ['sd-nd', 9],
    ['sd-ks', 10],
    ['sd-sd', 11],
    ['sd-ka', 12],
    ['sd-bn', 13],
    ['sd-rs', 14],
    ['sd-711', 15],
    ['sd-7281', 16]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sd/custom/sd-all-disputed'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sd/custom/sd-all-disputed.js">Sudan with disputed territories</a>'
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
