// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['gq-li', 0],
    ['gq-cs', 1],
    ['gq-kn', 2],
    ['gq-wn', 3],
    ['gq-bn', 4],
    ['gq-bs', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gq/gq-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/gq/gq-all.js">Equatorial Guinea</a>'
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
