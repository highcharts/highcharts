// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-nh', 0],
    ['nl-fr', 1],
    ['be-bu', 2],
    ['nl-gr', 3],
    ['nl-fl', 4],
    ['nl-ze', 5],
    ['be-3528', 6],
    ['be-3529', 7],
    ['be-489', 8],
    ['lu-di', 9],
    ['lu-gr', 10],
    ['lu-lu', 11],
    ['nl-nb', 12],
    ['nl-ut', 13],
    ['nl-zh', 14],
    ['nl-dr', 15],
    ['nl-ge', 16],
    ['nl-li', 17],
    ['be-vb', 18],
    ['be-490', 19],
    ['nl-ov', 20],
    ['be-3526', 21],
    ['be-3527', 22],
    ['be-3535', 23],
    ['be-ov', 24],
    ['be-3534', 25],
    ['undefined', 26]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/benelux'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/benelux.js">Benelux</a>'
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
