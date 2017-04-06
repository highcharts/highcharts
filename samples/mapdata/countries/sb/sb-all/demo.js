// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['sb-4191', 0],
    ['sb-ml', 1],
    ['sb-rb', 2],
    ['sb-1014', 3],
    ['sb-is', 4],
    ['sb-te', 5],
    ['sb-3343', 6],
    ['sb-ch', 7],
    ['sb-mk', 8],
    ['sb-6633', 9],
    ['sb-gc', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/sb/sb-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/sb/sb-all.js">Solomon Islands</a>'
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
