// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['li-6425', 0],
    ['li-6426', 1],
    ['li-6427', 2],
    ['li-6418', 3],
    ['li-3644', 4],
    ['li-6419', 5],
    ['li-6420', 6],
    ['li-6421', 7],
    ['li-6422', 8],
    ['li-6423', 9],
    ['li-6424', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/li/li-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/li/li-all.js">Liechtenstein</a>'
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
