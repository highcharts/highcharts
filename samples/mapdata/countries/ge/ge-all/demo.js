// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ge-ab', 0],
    ['ge-aj', 1],
    ['ge-gu', 2],
    ['ge-sz', 3],
    ['ge-im', 4],
    ['ge-ka', 5],
    ['ge-mm', 6],
    ['ge-rk', 7],
    ['ge-tb', 8],
    ['ge-kk', 9],
    ['ge-sj', 10],
    ['ge-sd', 11]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ge/ge-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ge/ge-all.js">Georgia</a>'
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
