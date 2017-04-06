// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['bs-rc', 0],
    ['bs-ri', 1],
    ['bs-ck', 2],
    ['bs-ak', 3],
    ['bs-bi', 4],
    ['bs-ht', 5],
    ['bs-ce', 6],
    ['bs-wg', 7],
    ['bs-eg', 8],
    ['bs-gc', 9],
    ['bs-co', 10],
    ['bs-so', 11],
    ['bs-mi', 12],
    ['bs-by', 13],
    ['bs-cs', 14],
    ['bs-sa', 15],
    ['bs-bp', 16],
    ['bs-ex', 17],
    ['bs-sw', 18],
    ['bs-hi', 19],
    ['bs-fp', 20],
    ['bs-ne', 21],
    ['bs-se', 22],
    ['bs-no', 23],
    ['bs-mc', 24],
    ['bs-ci', 25],
    ['bs-ss', 26],
    ['bs-li', 27],
    ['bs-mg', 28],
    ['bs-in', 29],
    ['bs-ns', 30],
    ['bs-nw', 31]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/bs/bs-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/bs/bs-all.js">The Bahamas</a>'
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
