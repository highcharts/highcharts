// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['am-gr', 0],
    ['am-av', 1],
    ['am-sh', 2],
    ['am-ar', 3],
    ['am-tv', 4],
    ['am-kt', 5],
    ['am-lo', 6],
    ['am-er', 7],
    ['am-su', 8],
    ['am-vd', 9],
    ['am-ag', 10]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/am/am-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/am/am-all.js">Armenia</a>'
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
