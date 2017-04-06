// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['dm-lu', 0],
    ['dm-ma', 1],
    ['dm-pk', 2],
    ['dm-da', 3],
    ['dm-pl', 4],
    ['dm-pr', 5],
    ['dm-an', 6],
    ['dm-go', 7],
    ['dm-jn', 8],
    ['dm-jh', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/dm/dm-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/dm/dm-all.js">Dominica</a>'
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
