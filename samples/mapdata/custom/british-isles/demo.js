// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ie-irl', 0],
    ['gb-eng', 1],
    ['gb-wls', 2],
    ['gb-sct', 3],
    ['gb-imn', 4],
    ['gb-nir', 5]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/british-isles'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/british-isles.js">British Isles</a>'
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
