// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cn-3664', 0],
    ['cn-gd', 1],
    ['cn-sh', 2],
    ['cn-zj', 3],
    ['cn-ha', 4],
    ['cn-xz', 5],
    ['cn-yn', 6],
    ['cn-ah', 7],
    ['cn-hu', 8],
    ['cn-sa', 9],
    ['cn-cq', 10],
    ['cn-gz', 11],
    ['cn-hn', 12],
    ['cn-sc', 13],
    ['cn-sx', 14],
    ['cn-he', 15],
    ['cn-jx', 16],
    ['cn-nm', 17],
    ['cn-gx', 18],
    ['cn-hl', 19],
    ['cn-fj', 20],
    ['cn-bj', 21],
    ['cn-hb', 22],
    ['cn-ln', 23],
    ['cn-sd', 24],
    ['cn-tj', 25],
    ['cn-js', 26],
    ['cn-qh', 27],
    ['cn-gs', 28],
    ['cn-xj', 29],
    ['cn-jl', 30],
    ['cn-nx', 31]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cn/cn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/cn-all.js">China</a>'
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
