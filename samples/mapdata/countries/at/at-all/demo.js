// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['at-wi', 0],
    ['at-vo', 1],
    ['at-bu', 2],
    ['at-st', 3],
    ['at-ka', 4],
    ['at-oo', 5],
    ['at-sz', 6],
    ['at-tr', 7],
    ['at-no', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/at/at-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/at/at-all.js">Austria</a>'
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
