// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['za-ec', 0],
    ['za-np', 1],
    ['za-nl', 2],
    ['za-wc', 3],
    ['za-nc', 4],
    ['za-nw', 5],
    ['za-fs', 6],
    ['za-gt', 7],
    ['za-mp', 8]
];

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'countries/za/za-all'
    },

    title: {
        text: 'Highmaps basic demo'
    },

    subtitle: {
        text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/za/za-all.js">South Africa</a>'
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
