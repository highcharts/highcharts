// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cn-3664', 0],
    ['cn-fj', 1],
    ['cn-gd', 2],
    ['cn-sh', 3],
    ['cn-zj', 4],
    ['cn-3681', 5],
    ['cn-3682', 6],
    ['cn-6655', 7],
    ['cn-6656', 8],
    ['cn-6658', 9],
    ['cn-6659', 10],
    ['cn-6660', 11],
    ['cn-6661', 12],
    ['cn-6662', 13],
    ['cn-6664', 14],
    ['cn-6668', 15],
    ['cn-nx', 16],
    ['cn-sa', 17],
    ['cn-cq', 18],
    ['cn-ah', 19],
    ['cn-hu', 20],
    ['cn-6657', 21],
    ['cn-6663', 22],
    ['cn-6665', 23],
    ['cn-6666', 24],
    ['cn-6667', 25],
    ['cn-6669', 26],
    ['cn-6670', 27],
    ['cn-6671', 28],
    ['cn-xz', 29],
    ['cn-yn', 30],
    ['cn-bj', 31],
    ['cn-hb', 32],
    ['cn-sd', 33],
    ['cn-tj', 34],
    ['cn-gs', 35],
    ['cn-jl', 36],
    ['cn-xj', 37],
    ['cn-sx', 38],
    ['cn-nm', 39],
    ['cn-hl', 40],
    ['cn-gx', 41],
    ['cn-ln', 42],
    ['cn-ha', 43],
    ['cn-js', 44],
    ['cn-sc', 45],
    ['cn-qh', 46],
    ['cn-he', 47],
    ['cn-gz', 48],
    ['cn-hn', 49],
    ['cn-jx', 50]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cn/custom/cn-all-sar'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar.js">China with Hong Kong and Macau</a>'
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
