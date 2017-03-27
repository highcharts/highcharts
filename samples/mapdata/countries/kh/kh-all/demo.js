// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kh-kk', 0],
    ['kh-pp', 1],
    ['kh-ka', 2],
    ['kh-om', 3],
    ['kh-ba', 4],
    ['kh-po', 5],
    ['kh-si', 6],
    ['kh-oc', 7],
    ['kh-pl', 8],
    ['kh-km', 9],
    ['kh-kg', 10],
    ['kh-kn', 11],
    ['kh-ks', 12],
    ['kh-kt', 13],
    ['kh-py', 14],
    ['kh-ph', 15],
    ['kh-st', 16],
    ['kh-kh', 17],
    ['kh-mk', 18],
    ['kh-ro', 19],
    ['kh-kp', 20],
    ['kh-ke', 21],
    ['kh-sr', 22],
    ['kh-ta', 23]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kh/kh-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kh/kh-all.js">Cambodia</a>'
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
