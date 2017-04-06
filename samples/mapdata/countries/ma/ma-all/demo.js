// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ma-rz', 0],
    ['ma-mt', 1],
    ['ma-td', 2],
    ['ma-or', 3],
    ['ma-fb', 4],
    ['ma-sm', 5],
    ['ma-mk', 6],
    ['ma-da', 7],
    ['ma-ge', 8],
    ['ma-lb', 9],
    ['ma-od', 10],
    ['ma-to', 11],
    ['ma-th', 12],
    ['ma-gb', 13],
    ['ma-co', 14],
    ['ma-gc', 15]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/ma/ma-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ma/ma-all.js">Morocco</a>'
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
