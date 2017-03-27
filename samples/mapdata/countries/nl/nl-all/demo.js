// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['nl-fr', 0],
    ['nl-gr', 1],
    ['nl-fl', 2],
    ['nl-ze', 3],
    ['nl-nh', 4],
    ['nl-zh', 5],
    ['nl-dr', 6],
    ['nl-ge', 7],
    ['nl-li', 8],
    ['nl-ov', 9],
    ['nl-nb', 10],
    ['nl-ut', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/nl/nl-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/nl/nl-all.js">The Netherlands</a>'
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
