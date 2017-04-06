// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['pk-sd', 0],
    ['pk-ba', 1],
    ['pk-jk', 2],
    ['pk-na', 3],
    ['pk-nw', 4],
    ['pk-ta', 5],
    ['pk-is', 6],
    ['pk-pb', 7]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/pk/pk-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/pk/pk-all.js">Pakistan</a>'
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
