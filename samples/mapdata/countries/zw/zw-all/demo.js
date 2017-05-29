// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['zw-ma', 0],
    ['zw-ms', 1],
    ['zw-bu', 2],
    ['zw-mv', 3],
    ['zw-mw', 4],
    ['zw-mc', 5],
    ['zw-ha', 6],
    ['zw-mn', 7],
    ['zw-mi', 8],
    ['zw-me', 9]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/zw/zw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/zw/zw-all.js">Zimbabwe</a>'
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
