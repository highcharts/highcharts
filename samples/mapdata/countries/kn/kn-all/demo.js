// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kn-tp', 0],
    ['kn-cc', 1],
    ['kn-as', 2],
    ['kn-gb', 3],
    ['kn-gg', 4],
    ['kn-jw', 5],
    ['kn-jc', 6],
    ['kn-jf', 7],
    ['kn-mc', 8],
    ['kn-pp', 9],
    ['kn-pl', 10],
    ['kn-pb', 11],
    ['kn-tl', 12],
    ['kn-tm', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kn/kn-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kn/kn-all.js">Saint Kitts and Nevis</a>'
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
