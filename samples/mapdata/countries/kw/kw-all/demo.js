// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['kw-ja', 0],
    ['kw-ku', 1],
    ['kw-fa', 2],
    ['kw-ah', 3],
    ['kw-1922', 4],
    ['kw-hw', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/kw/kw-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kw/kw-all.js">Kuwait</a>'
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
