// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kp-5044', 0],
    ['kp-wn', 1],
    ['kp-pb', 2],
    ['kp-nj', 3],
    ['kp-wb', 4],
    ['kp-py', 5],
    ['kp-hg', 6],
    ['kp-kw', 7],
    ['kp-ch', 8],
    ['kp-hn', 9],
    ['kp-pn', 10],
    ['kp-yg', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kp/kp-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kp/kp-all.js">North Korea</a>'
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
