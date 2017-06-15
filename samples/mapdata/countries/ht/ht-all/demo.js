// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ht-ou', 0],
    ['ht-gr', 1],
    ['ht-no', 2],
    ['ht-sd', 3],
    ['ht-ni', 4],
    ['ht-ar', 5],
    ['ht-ce', 6],
    ['ht-ne', 7],
    ['ht-nd', 8],
    ['ht-se', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ht/ht-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ht/ht-all.js">Haiti</a>'
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
