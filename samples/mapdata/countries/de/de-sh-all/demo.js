// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['de-sh-01054000', 0],
    ['de-sh-01051000', 1],
    ['de-sh-01055000', 2],
    ['de-sh-01056000', 3],
    ['de-sh-01061000', 4],
    ['de-sh-01053000', 5],
    ['de-sh-01002000', 6],
    ['de-sh-01059000', 7],
    ['de-sh-01001000', 8],
    ['de-sh-01062000', 9],
    ['de-sh-01003000', 10],
    ['de-sh-01060000', 11],
    ['de-sh-01004000', 12],
    ['de-sh-01058000', 13],
    ['de-sh-01057000', 14]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/de/de-sh-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/de/de-sh-all.js">Schleswig-Holstein</a>'
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
