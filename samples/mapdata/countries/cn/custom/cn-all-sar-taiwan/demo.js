// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['tw-ph', 0],
    ['cn-sh', 1],
    ['tw-km', 2],
    ['cn-zj', 3],
    ['tw-lk', 4],
    ['cn-3664', 5],
    ['cn-3681', 6],
    ['cn-fj', 7],
    ['cn-gd', 8],
    ['tw-tw', 9],
    ['tw-cs', 10],
    ['cn-6657', 11],
    ['cn-6663', 12],
    ['cn-6665', 13],
    ['cn-6666', 14],
    ['cn-6667', 15],
    ['cn-6669', 16],
    ['cn-6670', 17],
    ['cn-6671', 18],
    ['tw-kh', 19],
    ['tw-hs', 20],
    ['cn-yn', 21],
    ['cn-xz', 22],
    ['tw-hh', 23],
    ['tw-cl', 24],
    ['tw-ml', 25],
    ['cn-nx', 26],
    ['cn-sa', 27],
    ['tw-ty', 28],
    ['cn-3682', 29],
    ['tw-cg', 30],
    ['cn-6655', 31],
    ['cn-ah', 32],
    ['cn-hu', 33],
    ['tw-hl', 34],
    ['tw-th', 35],
    ['cn-6656', 36],
    ['tw-nt', 37],
    ['cn-6658', 38],
    ['cn-6659', 39],
    ['cn-cq', 40],
    ['cn-hn', 41],
    ['tw-yl', 42],
    ['cn-6660', 43],
    ['cn-6661', 44],
    ['cn-6662', 45],
    ['cn-6664', 46],
    ['cn-6668', 47],
    ['tw-pt', 48],
    ['tw-tt', 49],
    ['tw-tn', 50],
    ['cn-bj', 51],
    ['cn-hb', 52],
    ['tw-il', 53],
    ['tw-tp', 54],
    ['cn-sd', 55],
    ['tw-ch', 56],
    ['cn-tj', 57],
    ['cn-ha', 58],
    ['cn-jl', 59],
    ['cn-qh', 60],
    ['cn-xj', 61],
    ['cn-nm', 62],
    ['cn-hl', 63],
    ['cn-sc', 64],
    ['cn-gz', 65],
    ['cn-gx', 66],
    ['cn-ln', 67],
    ['cn-js', 68],
    ['cn-gs', 69],
    ['cn-sx', 70],
    ['cn-he', 71],
    ['cn-jx', 72]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cn/custom/cn-all-sar-taiwan'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cn/custom/cn-all-sar-taiwan.js">China with Hong Kong, Macau, and Taiwan</a>'
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
