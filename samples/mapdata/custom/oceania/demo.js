// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['id', 0],
    ['pw', 1],
    ['sb', 2],
    ['au', 3],
    ['nz', 4],
    ['nr', 5],
    ['tv', 6],
    ['pg', 7],
    ['mh', 8],
    ['fm', 9],
    ['vu', 10],
    ['my', 11],
    ['fj', 12],
    ['ph', 13]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/oceania'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/oceania.js">Oceania</a>'
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
