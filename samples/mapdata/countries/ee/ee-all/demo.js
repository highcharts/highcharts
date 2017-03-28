// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ee-6019', 0],
    ['ee-ha', 1],
    ['ee-ta', 2],
    ['ee-hi', 3],
    ['ee-ln', 4],
    ['ee-pr', 5],
    ['ee-sa', 6],
    ['ee-iv', 7],
    ['ee-jr', 8],
    ['ee-jn', 9],
    ['ee-lv', 10],
    ['ee-pl', 11],
    ['ee-ra', 12],
    ['ee-vg', 13],
    ['ee-vd', 14],
    ['ee-vr', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ee/ee-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ee/ee-all.js">Estonia</a>'
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
