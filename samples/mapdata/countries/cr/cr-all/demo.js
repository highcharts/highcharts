// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['cr-pu', 0],
    ['cr-sj', 1],
    ['cr-al', 2],
    ['cr-gu', 3],
    ['cr-li', 4],
    ['cr-ca', 5],
    ['cr-he', 6]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/cr/cr-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/cr/cr-all.js">Costa Rica</a>'
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
